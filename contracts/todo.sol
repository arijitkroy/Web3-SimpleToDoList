// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Todo {

    struct Task {
        uint256 id;
        string content;
        bool completed;
        uint256 createdAt;
    }

    mapping(address => Task[]) private tasks;

    event TaskCreated(address indexed user, uint256 id, string content);
    event TaskToggled(address indexed user, uint256 id, bool completed);

    function addTask(string calldata _content) external {
        require(bytes(_content).length > 0, "Empty task");

        uint256 id = tasks[msg.sender].length;

        tasks[msg.sender].push(Task({
            id: id,
            content: _content,
            completed: false,
            createdAt: block.timestamp
        }));

        emit TaskCreated(msg.sender, id, _content);
    }

    function toggleTask(uint256 _id) external {
        require(_id < tasks[msg.sender].length, "Invalid ID");

        Task storage task = tasks[msg.sender][_id];
        task.completed = !task.completed;

        emit TaskToggled(msg.sender, _id, task.completed);
    }

    function getTasks() external view returns (Task[] memory) {
        return tasks[msg.sender];
    }
}