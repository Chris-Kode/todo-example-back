import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateTaskDto } from '../src/DTOs/create.dto';
import { UpdateTaskDto } from '../src/DTOs/update.dto';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let taskId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/create (POST) - should create a new task', () => {
    const createTaskDto: CreateTaskDto = {
      title: 'E2E Test Task',
      description: 'Testing with supertest',
    };

    return request(app.getHttpServer())
      .post('/create')
      .send(createTaskDto)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(createTaskDto.title);
        expect(response.body.description).toBe(createTaskDto.description);
        expect(response.body.completed).toBe(false);

        // Save the task ID for later tests
        taskId = response.body.id;
      });
  });

  it('/tasks (GET) - should return array of tasks', () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('title');
        expect(response.body[0]).toHaveProperty('description');
        expect(response.body[0]).toHaveProperty('completed');
      });
  });

  it('/tasks/:id (GET) - should return a task by id', () => {
    return request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(taskId);
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('description');
        expect(response.body).toHaveProperty('completed');
      });
  });

  it('/tasks/:id (GET) - should return 404 for non-existent task', () => {
    return request(app.getHttpServer())
      .get('/tasks/999')
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe('Task with ID 999 not found');
      });
  });

  it('/tasks/:id (PUT) - should update a task', () => {
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated E2E Test Task',
      completed: true,
    };

    return request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .send(updateTaskDto)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(taskId);
        expect(response.body.title).toBe(updateTaskDto.title);
        expect(response.body.completed).toBe(updateTaskDto.completed);
      });
  });

  it('/tasks/:id (PUT) - should return 404 for non-existent task', () => {
    const updateTaskDto: UpdateTaskDto = {
      title: 'This will fail',
    };

    return request(app.getHttpServer())
      .put('/tasks/999')
      .send(updateTaskDto)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe('Task with ID 999 not found');
      });
  });

  it('/tasks/:id (DELETE) - should delete a task', () => {
    return request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe(
          `Task with ID ${taskId} deleted successfully`,
        );
      });
  });

  it('/tasks/:id (DELETE) - should return 404 for non-existent task', () => {
    return request(app.getHttpServer())
      .delete('/tasks/999')
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe('Task with ID 999 not found');
      });
  });

  // Validation tests
  it('/create (POST) - should validate task data', () => {
    const invalidTask = {
      // Missing title and description
    };

    return request(app.getHttpServer())
      .post('/create')
      .send(invalidTask)
      .expect(400);
  });

  it('/create (POST) - should validate task data types', () => {
    const invalidTask = {
      title: 123, // Should be string
      description: true, // Should be string
    };

    return request(app.getHttpServer())
      .post('/create')
      .send(invalidTask)
      .expect(400);
  });
});
