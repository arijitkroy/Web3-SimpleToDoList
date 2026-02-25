// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Todo {

    struct Task {
        uint256 id;
        string content;
        bool completed;
        bool deleted;
        uint256 createdAt;
    }

    mapping(address => Task[]) private tasks;

    event TaskCreated(address indexed user, uint256 id, string content);
    event TaskToggled(address indexed user, uint256 id, bool completed);
    event TaskEdited(address indexed user, uint256 id, string newContent);
    event TaskDeleted(address indexed user, uint256 id);

    function addTask(string calldata _content) external {
        require(bytes(_content).length > 0, "Empty task");

        uint256 id = tasks[msg.sender].length;

        tasks[msg.sender].push(Task({
            id: id,
            content: _content,
            completed: false,
            deleted: false,
            createdAt: block.timestamp
        }));

        emit TaskCreated(msg.sender, id, _content);
    }

    function toggleTask(uint256 _id) external {
        require(_id < tasks[msg.sender].length, "Invalid ID");
        Task storage task = tasks[msg.sender][_id];
        require(!task.deleted, "Task deleted");

        task.completed = !task.completed;

        emit TaskToggled(msg.sender, _id, task.completed);
    }

    function editTask(uint256 _id, string calldata _content) external {
        require(_id < tasks[msg.sender].length, "Invalid ID");
        require(bytes(_content).length > 0, "Empty task");
        Task storage task = tasks[msg.sender][_id];
        require(!task.deleted, "Task deleted");

        task.content = _content;

        emit TaskEdited(msg.sender, _id, _content);
    }

    function deleteTask(uint256 _id) external {
        require(_id < tasks[msg.sender].length, "Invalid ID");
        Task storage task = tasks[msg.sender][_id];
        require(!task.deleted, "Already deleted");

        task.deleted = true;

        emit TaskDeleted(msg.sender, _id);
    }

    function getTasks() external view returns (Task[] memory) {
        return tasks[msg.sender];
    }
}