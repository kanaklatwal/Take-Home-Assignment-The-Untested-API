# Bug Report

## Overview

While testing the Task Manager API, I identified the following issues.

---

## Bug 1: Incorrect Pagination Offset (Fixed)

**Location**
`src/services/taskService.js`

**Expected Behavior**
Requesting `page=1&limit=10` should return the first 10 tasks.

**Actual Behavior**
The API skipped the first 10 tasks because the offset was calculated as:

```javascript
const offset = page * limit;
```

**How I Discovered It**
I wrote a unit test for pagination using Jest. The test failed because page 1 started from Task 11 instead of Task 1.

**Fix Implemented**

Changed:

```javascript
const offset = page * limit;
```

to

```javascript
const offset = (page - 1) * limit;
```

---

## Bug 2: Status Filtering Uses Partial Match

**Location**
`src/services/taskService.js`

**Expected Behavior**
Filtering by status should return only tasks with the exact status.

**Actual Behavior**
The implementation uses:

```javascript
t.status.includes(status)
```

This allows partial matches instead of exact matches.

**Suggested Fix**

```javascript
t.status === status
```

---

## Bug 3: Completing a Task Changes Priority

**Location**
`src/services/taskService.js`

**Expected Behavior**
Completing a task should only update its status and completion time.

**Actual Behavior**
The task priority is always changed to `"medium"` when marking a task as complete.

**Suggested Fix**
Keep the original priority unchanged.