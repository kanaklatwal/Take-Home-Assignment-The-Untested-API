const request = require("supertest");
const app = require("../src/app");
const taskService = require("../src/services/taskService");

beforeEach(() => {
    taskService._reset();
});

test("GET /tasks should return empty array", async () => {

    const res = await request(app).get("/tasks");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);

});

test("POST /tasks should create task", async () => {

    const res = await request(app)
        .post("/tasks")
        .send({
            title: "Study Jest"
        });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Study Jest");
    expect(res.body.status).toBe("todo");

});

test("POST /tasks without title should return 400", async () => {

    const res = await request(app)
        .post("/tasks")
        .send({});

    expect(res.statusCode).toBe(400);

});

test("PUT /tasks/:id should update task", async () => {

    const created = await request(app)
        .post("/tasks")
        .send({
            title: "Old Task"
        });

    const id = created.body.id;

    const res = await request(app)
        .put(`/tasks/${id}`)
        .send({
            title: "New Task"
        });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("New Task");

});

test("DELETE /tasks/:id should delete task", async () => {

    const created = await request(app)
        .post("/tasks")
        .send({
            title: "Delete Me"
        });

    const id = created.body.id;

    const res = await request(app)
        .delete(`/tasks/${id}`);

    expect(res.statusCode).toBe(204);

});

test("PATCH /tasks/:id/complete should complete task", async () => {

    const created = await request(app)
        .post("/tasks")
        .send({
            title: "Complete Me"
        });

    const id = created.body.id;

    const res = await request(app)
        .patch(`/tasks/${id}/complete`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("done");

});

test("GET /tasks/stats should return stats", async () => {

    await request(app)
        .post("/tasks")
        .send({
            title: "Task A"
        });

    const res = await request(app)
        .get("/tasks/stats");

    expect(res.statusCode).toBe(200);
    expect(res.body.todo).toBe(1);

});

test("PATCH /tasks/:id/assign should assign task", async () => {

    const created = await request(app)
        .post("/tasks")
        .send({
            title: "Assignment"
        });

    const id = created.body.id;

    const res = await request(app)
        .patch(`/tasks/${id}/assign`)
        .send({
            assignee: "Kanak"
        });

    expect(res.statusCode).toBe(200);
    expect(res.body.assignee).toBe("Kanak");

});

test("PATCH /tasks/:id/assign should return 400 for empty assignee", async () => {

    const created = await request(app)
        .post("/tasks")
        .send({
            title: "Assignment"
        });

    const id = created.body.id;

    const res = await request(app)
        .patch(`/tasks/${id}/assign`)
        .send({
            assignee: ""
        });

    expect(res.statusCode).toBe(400);

});