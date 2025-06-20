const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const BloodRequest = require("../models/BloodRequest");

// Initiate a chat or get existing chat room
router.post("/initiate", auth, async (req, res) => {
  const { bloodRequestId } = req.body;
  const donorId = req.user._id;

  try {
    const bloodRequest = await BloodRequest.findById(bloodRequestId);
    if (!bloodRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Blood request not found." });
    }

    const requesterId = bloodRequest.requesterId;

    // Check if a chat room already exists between the two users for this request
    let chatRoom = await ChatRoom.findOne({
      bloodRequestId,
      participants: { $all: [donorId, requesterId] },
    });

    if (!chatRoom) {
      chatRoom = new ChatRoom({
        bloodRequestId,
        participants: [donorId, requesterId],
      });
      await chatRoom.save();
    }

    res.json({ success: true, chatRoomId: chatRoom._id });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get messages for a chat room
router.get("/:chatRoomId/messages", auth, async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const messages = await Message.find({ chatRoomId })
      .populate("senderId", "fullName")
      .sort({ createdAt: "asc" });

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
