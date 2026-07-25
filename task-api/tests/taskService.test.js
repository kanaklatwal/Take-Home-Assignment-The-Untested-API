const taskService = require("../src/services/taskService");

beforeEach(() => {
    taskService._reset();
});

test("should create a task", () => {

    const task = taskService.create({
        title: "Learn Jest"
    });

    expect(task.title).toBe("Learn Jest");
    expect(task.status).toBe("todo");
    expect(task.priority).toBe("medium");
});

test("should return all tasks", () => {
    taskService.create({ title: "Task 1" });
    taskService.create({ title: "Task 2" });

    const tasks = taskService.getAll();

    expect(tasks).toHaveLength(2);
});

test("should delete task", () => {
    const task = taskService.create({
        title: "Delete Me"
    });

    const deleted = taskService.remove(task.id);

    expect(deleted).toBe(true);
});

test("should return false when deleting invalid task", () => {
    expect(taskService.remove("invalid-id")).toBe(false);
});

test("should complete task", () => {
    const task = taskService.create({
        title: "API Assignment",
        priority: "high"
    });

    const updated = taskService.completeTask(task.id);

    expect(updated.status).toBe("done");
    expect(updated.completedAt).not.toBeNull();
});

test("should return first page correctly", () => {
    for (let i = 1; i <= 15; i++) {
        taskService.create({
            title: `Task ${i}`
        });
    }

    const page1 = taskService.getPaginated(1, 10);

    expect(page1).toHaveLength(10);
    expect(page1[0].title).toBe("Task 1");
});