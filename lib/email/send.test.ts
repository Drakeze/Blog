import { beforeEach, expect, mock, test } from 'bun:test';

// Mutable fake env — `sendEmail` reads `env.EMAIL_DELIVERY_MODE` at call time.
const fakeEnv = {
  env: {
    EMAIL_DELIVERY_MODE: 'log' as 'live' | 'log' | 'off',
    RESEND_FROM_EMAIL: 'from@test.dev',
    RESEND_REPLY_TO_EMAIL: undefined as string | undefined,
    RESEND_API_KEY: '',
  },
};

let inserted: Array<Record<string, unknown>> = [];

mock.module('@/lib/env', () => fakeEnv);
mock.module('@/lib/mongo', () => ({
  blogCollectionNames: { emailLogs: 'email_logs' },
  getDb: async () => ({
    collection: () => ({
      insertOne: async (doc: Record<string, unknown>) => {
        inserted.push(doc);
      },
    }),
  }),
}));
mock.module('./resend', () => ({
  getResendClient: () => {
    throw new Error('resend must not be constructed in log/off mode');
  },
}));

const { sendEmail } = await import('./send');

beforeEach(() => {
  inserted = [];
});

const input = {
  to: 'reader@test.dev',
  subject: 'Hello',
  html: '<p>hi</p>',
  template: 'newsletter',
};

test('log mode: nothing sent, one EmailLog row with status "skipped"', async () => {
  fakeEnv.env.EMAIL_DELIVERY_MODE = 'log';
  const res = await sendEmail(input);

  expect(res).toEqual({ id: null, skipped: true });
  expect(inserted).toHaveLength(1);
  expect(inserted[0]).toMatchObject({
    status: 'skipped',
    template: 'newsletter',
    to: 'reader@test.dev',
  });
});

test('off mode: nothing sent, no EmailLog row', async () => {
  fakeEnv.env.EMAIL_DELIVERY_MODE = 'off';
  const res = await sendEmail(input);

  expect(res).toEqual({ id: null, skipped: true });
  expect(inserted).toHaveLength(0);
});

test('rejects an empty subject before doing anything', async () => {
  fakeEnv.env.EMAIL_DELIVERY_MODE = 'log';
  await expect(sendEmail({ ...input, subject: '  ' })).rejects.toThrow();
  expect(inserted).toHaveLength(0);
});
