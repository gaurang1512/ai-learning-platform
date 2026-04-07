import { jest } from "@jest/globals";

// Define the mock before importing the service
jest.unstable_mockModule("groq-sdk", () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn()
        }
      }
    }))
  };
});

// Use dynamic import to ensure the mock is applied
const { generateTopicContent } = await import("../services/ai.service.js");
const { default: Groq } = await import("groq-sdk");

describe("AI Service - generateTopicContent", () => {
  let groqInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // In ESM, we need to handle the mock instance differently
    groqInstance = new Groq();
    Groq.mockImplementation(() => groqInstance);
  });

  it("should successfully generate content on the first attempt", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              explanation: "Test explanation",
              quiz: [
                {
                  question: "Q1",
                  options: ["A", "B", "C", "D"],
                  correctAnswer: 0,
                  explanation: "Exp"
                }
              ]
            })
          }
        }
      ]
    };

    groqInstance.chat.completions.create.mockResolvedValueOnce(mockResponse);

    const result = await generateTopicContent("JavaScript", "Beginner");

    expect(result).toBeDefined();
    expect(result.explanation).toBe("Test explanation");
    expect(result.quiz).toHaveLength(1);
    expect(groqInstance.chat.completions.create).toHaveBeenCalledTimes(1);
  });

  it("should fall back to the next model if the first one fails", async () => {
    const mockError = new Error("Model limit reached");
    const mockSuccessResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              explanation: "Fallback explanation",
              quiz: []
            })
          }
        }
      ]
    };

    groqInstance.chat.completions.create
      .mockRejectedValueOnce(mockError) // First model fails
      .mockResolvedValueOnce(mockSuccessResponse); // Second model succeeds

    const result = await generateTopicContent("React", "Intermediate");

    expect(result.explanation).toBe("Fallback explanation");
    expect(groqInstance.chat.completions.create).toHaveBeenCalledTimes(2);
  });

  it("should extract JSON even if the model returns extra text or code blocks", async () => {
    const contentWithMarkdown = "Here is the JSON: ```json\n{\"explanation\": \"Markdown test\", \"quiz\": []}\n``` Hope this helps!";
    const mockResponse = {
      choices: [
        {
          message: {
            content: contentWithMarkdown
          }
        }
      ]
    };

    groqInstance.chat.completions.create.mockResolvedValueOnce(mockResponse);

    const result = await generateTopicContent("Node.js", "Advanced");

    expect(result.explanation).toBe("Markdown test");
    expect(groqInstance.chat.completions.create).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if all models fail", async () => {
    groqInstance.chat.completions.create.mockRejectedValue(new Error("API Error"));

    await expect(generateTopicContent("CSS", "Beginner")).rejects.toThrow(
      /Failed to generate content and quiz after multiple attempts/
    );
    
    // Should have tried all 4 models defined in the service
    expect(groqInstance.chat.completions.create).toHaveBeenCalledTimes(4);
  });

  it("should stop immediately on authentication error (401)", async () => {
    const authError = new Error("Unauthorized");
    authError.status = 401;

    groqInstance.chat.completions.create.mockRejectedValueOnce(authError);

    await expect(generateTopicContent("HTML", "Beginner")).rejects.toThrow(
      /AI Service authentication failed/
    );

    // Should only attempt once if 401 is encountered
    expect(groqInstance.chat.completions.create).toHaveBeenCalledTimes(1);
  });

  it("should throw error if required parameters are missing", async () => {
    await expect(generateTopicContent(null, "Beginner")).rejects.toThrow("topicName and level required");
    await expect(generateTopicContent("JS", null)).rejects.toThrow("topicName and level required");
  });
});
