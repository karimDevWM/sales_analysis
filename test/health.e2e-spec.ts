import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/health/liveness (GET)', () => {
    return request(app.getHttpServer())
      .get('/health/liveness')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
      });
  });

  it('/health/readiness (GET)', () => {
    // Note: This might fail if the database is not reachable in the test environment
    return request(app.getHttpServer())
      .get('/health/readiness')
      .then(response => {
        // We accept 200 (ok) or 503 (service unavailable if DB is down)
        // because we want to check if the endpoint is correctly registered
        expect([200, 503]).toContain(response.status);
      });
  });
});
