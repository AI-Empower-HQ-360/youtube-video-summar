/**
 * Chat Routes
 * Handles customer service chat API endpoints
 */

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

/**
 * @route   POST /api/chat/session
 * @desc    Start a new chat session
 * @access  Public
 */
router.post('/session', chatController.startSession);

/**
 * @route   POST /api/chat/message
 * @desc    Send a message and get AI response
 * @access  Public
 */
router.post('/message', chatController.sendMessage);

/**
 * @route   POST /api/chat/ai-response
 * @desc    Get AI-powered response
 * @access  Public
 */
router.post('/ai-response', chatController.getAIResponse);

/**
 * @route   POST /api/chat/suggestions
 * @desc    Get suggested questions
 * @access  Public
 */
router.post('/suggestions', chatController.getSuggestions);

/**
 * @route   POST /api/chat/session/end
 * @desc    End a chat session
 * @access  Public
 */
router.post('/session/end', chatController.endSession);

/**
 * @route   POST /api/chat/feedback
 * @desc    Save user feedback for a message
 * @access  Public
 */
router.post('/feedback', chatController.saveFeedback);

module.exports = router;
