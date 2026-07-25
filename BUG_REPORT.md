# Bug Report

## Overview

While testing and reviewing the Task Manager API, I identified the following issues. I wrote unit and integration tests using Jest and Supertest to validate the application behavior. One bug was fixed as part of this assignment, while the remaining issues are documented with suggested fixes.

---

## Bug 1: Incorrect Pagination Offset (Fixed)

### Location
`src/services/taskService.js`

### Expected Behavior
Requesting `page=1&limit=10` should return the first 10 tasks.

### Actual Behavior
The API skipped the first 10 tasks because the pagination offset was calculated incorrectly.

### Root Cause

```javascript
const offset = page * limit;
```

For `page=1` and `limit=10`, the offset becomes `10` instead of `0`.

### How I Discovered It
I wrote a unit test for pagination, which failed because the first page started with **Task 11** instead of **Task 1**.

### Fix Implemented

Changed:

```javascript
const offset = page * limit;
```

to:

```javascript
const offset = (page - 1) * limit;
```

---

## Bug 2: Status Filtering Uses Partial Matching

### Location
`src/services/taskService.js`

### Expected Behavior
Filtering by status should return only tasks whose status exactly matches the requested value.

### Actual Behavior

The implementation uses:

```javascript
t.status.includes(status)
```

This allows partial matches.

Example:

```
GET /tasks?status=do
```

returns tasks with status:

```
done
```

instead of rejecting the invalid status.

### Suggested Fix

```javascript
t.status === status
```

---

## Bug 3: Completing a Task Resets Priority

### Location
`src/services/taskService.js`

### Expected Behavior

Completing a task should only update:

- status
- completedAt

The existing priority should remain unchanged.

### Actual Behavior

The implementation always changes the priority to:

```javascript
priority: "medium"
```

As a result, a **high-priority** or **low-priority** task loses its original priority after completion.

### Suggested Fix

Do not overwrite the existing priority when marking a task as complete.