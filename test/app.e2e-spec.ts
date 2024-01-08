import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';

describe('App e2e', () => {
  // create mockserver
  let app: INestApplication;
  // let prisma: PrismaClient;
  beforeAll(async () => {
    const ModuleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = ModuleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen('3333');
    pactum.request.setBaseUrl('http://localhost:3000/');
  });

  // afterAll(async () => {

  //   await app.close();
  // });

  describe('Auth', () => {
    const auth = {
      email: 'gamaSadya@gmail.com',
      username: 'gamagamol',
      password: 'gamagamol',
      confirmPassword: 'gamagamol',
    };

    describe('register', () => {
      it('failed register without email', () => {
        return pactum
          .spec()
          .post('api/register')
          .withBody({
            password: auth.password,
          })
          .expectStatus(400);
      });

      it('failed register Duplikat email', () => {
        return pactum
          .spec()
          .post('api/register')
          .withBody({
            email: 'gamaariefsadya@gmail.com',
          })
          .expectStatus(400);
      });

      it('failed register without password', () => {
        return pactum
          .spec()
          .post('api/register')
          .withBody({
            email: auth.email,
          })
          .expectStatus(400);
      });

      it('failed register without confirm password', () => {
        return pactum
          .spec()
          .post('api/register')
          .withBody({
            email: auth.email,
            password: auth.password,
            confirmPassword: auth.confirmPassword,
          })
          .expectStatus(400);
      });

      it('success register ', () => {
        return pactum
          .spec()
          .post('api/register')
          .withBody(auth)
          .expectStatus(201)
          .stores('user_id', 'Payload.id');
      });
    });

    describe('login', () => {
      it('success login', () => {
        return pactum
          .spec()
          .post('api/login')
          .withBody({
            email: auth.email,
            password: auth.password,
          })
          .expectStatus(201)
          .stores('token', 'access_token');
      });

      it('failed login without ussername', () => {
        return pactum
          .spec()
          .post('api/login')
          .withBody({
            password: auth.password,
          })
          .expectStatus(400);
      });
      it('failed login without password', () => {
        return pactum
          .spec()
          .post('api/login')
          .withBody({
            email: auth.email,
          })
          .expectStatus(400);
      });
    });
  });

  describe('profile', () => {
    const profileUrl: string = 'api/profile';
    describe('Get Profile', () => {
      it('Get All Users', () => {
        return pactum
          .spec()
          .get(profileUrl)
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .expectStatus(200);
      });

      it('Get profile by id', () => {
        return pactum
          .spec()
          .get(profileUrl + '/{id}')
          .withPathParams('id', '$S{user_id}')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .expectStatus(200);
      });
    });

    describe('Update Profile after register', () => {
      it('success', () => {
        return pactum
          .spec()
          .patch(profileUrl + '/{id}')
          .withPathParams('id', '$S{user_id}')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody({
            name: 'Gama',
            gender: 'Male',
            height: 10,
            weight: 70,
            birthday: '2023-02-26',
            heightUnit: 'cm',
          })
          .expectStatus(200);
      });

      it('failed without name', () => {
        return pactum
          .spec()
          .patch(profileUrl + '/{id}')
          .withPathParams('id', '$S{user_id}')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody({
            gender: 'Male',
            height: 10,
            weight: 70,
            birthday: '2023-02-26',
            heightUnit: 'cm',
          })
          .expectStatus(400);
      });

      it('failed wrong data type ', () => {
        return pactum
          .spec()
          .patch(profileUrl + '/{id}')
          .withPathParams('id', '$S{user_id}')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody({
            gender: 'Male',
            height: '10',
            weight: 70,
            birthday: '2023-02-26',
            heightUnit: 'cm',
          })
          .expectStatus(400);
      });

      it('failed hightunit should be string ', () => {
        return pactum
          .spec()
          .patch(profileUrl + '/{id}')
          .withPathParams('id', '$S{user_id}')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody({
            gender: 'Male',
            height: '10',
            weight: 70,
            birthday: '2023-02-26',
            heightUnit: 123,
          })
          .expectStatus(400);
      });

      it('failed hightunit should be cm/in ', () => {
        return pactum
          .spec()
          .patch(profileUrl + '/{id}')
          .withPathParams('id', '$S{user_id}')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody({
            gender: 'Male',
            height: '10',
            weight: 70,
            birthday: '2023-02-26',
            heightUnit: '123',
          })
          .expectStatus(400);
      });
    });

    describe('insert interest', () => {
      it('success', () => {
        return pactum
          .spec()
          .post(profileUrl + '/interest/{id}')
          .withPathParams('id', '$S{user_id}')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody({
            interets: 'football',
          })
          .expectStatus(201);
      });

      it('failed', () => {
        return pactum
          .spec()
          .post(profileUrl + '/interest/{id}')
          .withPathParams('id', '$S{user_id}')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .expectStatus(400);
      });
    });

    describe('delete interest', () => {
      it('success', () => {
        return pactum
          .spec()
          .delete(profileUrl + '/interest/{id}')
          .withPathParams('id', '$S{user_id}')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .withBody({
            interets: 'football',
          })
          .expectStatus(200);
      });
      it('failed', () => {
        return pactum
          .spec()
          .delete(profileUrl + '/interest/{id}')
          .withPathParams('id', '$S{user_id}')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .expectStatus(400);
      });
    });

    describe('delete user', () => {
      it('success', () => {
        return pactum
          .spec()
          .delete(profileUrl + '/{id}')
          .withPathParams('id', '$S{user_id}')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .expectStatus(200);
      });
    });
  });
});
