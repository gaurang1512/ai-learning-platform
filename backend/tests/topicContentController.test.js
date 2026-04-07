import { jest } from "@jest/globals";

// Mock the dependencies
jest.unstable_mockModule("../models/TopicContent.model.js", () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.unstable_mockModule("../services/ai.service.js", () => ({
  generateTopicContent: jest.fn(),
}));

const { default: TopicContent } = await import("../models/TopicContent.model.js");
const { generateTopicContent } = await import("../services/ai.service.js");
const { getTopicContent } = await import("../controller/topicContent.js");

describe("TopicContent Controller", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {
        topicName: "JavaScript",
        learningPathId: "507f1f77bcf86cd799439011",
        level: "Beginner",
      },
      user: {
        id: "507f1f77bcf86cd799439012",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("should return 401 if user is not authenticated", async () => {
    req.user = null;
    await getTopicContent(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "User not authenticated" });
  });

  it("should return 401 if user id is missing", async () => {
    req.user = {};
    await getTopicContent(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "User not authenticated" });
  });

  it("should return 400 if topicName or learningPathId is missing", async () => {
    req.body.topicName = null;
    await getTopicContent(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "topicName and learningPathId are required" });
  });

  it("should return existing content if found", async () => {
    const mockContent = { topicName: "JavaScript", content: "Existing" };
    TopicContent.findOne.mockResolvedValue(mockContent);

    await getTopicContent(req, res);

    expect(TopicContent.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockContent);
  });

  it("should generate and save new content if not found", async () => {
    TopicContent.findOne.mockResolvedValue(null);
    const mockAiResult = { explanation: "New content", quiz: [] };
    generateTopicContent.mockResolvedValue(mockAiResult);
    const mockSavedContent = { ...mockAiResult, _id: "new_id" };
    TopicContent.create.mockResolvedValue(mockSavedContent);

    await getTopicContent(req, res);

    expect(generateTopicContent).toHaveBeenCalledWith("JavaScript", "Beginner");
    expect(TopicContent.create).toHaveBeenCalledWith(expect.objectContaining({
      userId: req.user.id,
      topicName: "JavaScript",
      content: "New content",
    }));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockSavedContent);
  });

  it("should handle req.user._id if id is missing", async () => {
    req.user = { _id: "507f1f77bcf86cd799439012" };
    TopicContent.findOne.mockResolvedValue({ topicName: "JS" });

    await getTopicContent(req, res);

    expect(TopicContent.findOne).toHaveBeenCalledWith(expect.objectContaining({
      userId: "507f1f77bcf86cd799439012"
    }));
  });

  it("should handle errors gracefully", async () => {
    TopicContent.findOne.mockRejectedValue(new Error("Database error"));

    await getTopicContent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
  });
});
