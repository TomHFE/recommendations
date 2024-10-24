import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Commentsalert from "../../src/components/commentsalert";

const mockCreateComment = async (token, comment, recipeId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ comment: { message: comment } });
    }, 100);
  });
};

describe("Commentsalert component", () => {
  const mockComments = [{ message: "First comment" }];
  const mockRecipeId = "123";

  let commentsList = [...mockComments];

  const setComments = (updateFn) => {
    commentsList = updateFn(commentsList);
  };

  const originalCreateComment = Commentsalert.createComment;

  beforeAll(() => {
    Commentsalert.createComment = mockCreateComment;
  });

  afterAll(() => {
    Commentsalert.createComment = originalCreateComment;
  });

  test("renders initial comments correctly", () => {
    render(
      <Commentsalert
        comments={commentsList}
        onClose={() => {}}
        recipe_id={mockRecipeId}
        setComments={setComments}
      />
    );

    const commentElement = screen.getByText("First comment");
    expect(commentElement).toBeTruthy();
  });

  test("renders the 'No comments yet' message if no comments are passed", () => {
    render(
      <Commentsalert
        comments={[]}
        onClose={() => {}}
        recipe_id={mockRecipeId}
        setComments={setComments}
      />
    );

    const noCommentsMessage = screen.getByText(
      "No comments yet. Be the first to comment!"
    );
    expect(noCommentsMessage).toBeTruthy(); // Verify that the no comments message exists
  });

  test("adds a new comment on form submission", async () => {
    commentsList = [...mockComments];

    render(
      <Commentsalert
        comments={commentsList}
        onClose={() => {}}
        recipe_id={mockRecipeId}
        setComments={setComments}
      />
    );

    const inputElement = screen.getByPlaceholderText("Type your comment here");
    fireEvent.change(inputElement, { target: { value: "New comment" } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(commentsList).toHaveLength(1);
    });
  });

  test("closes the modal when the close button is clicked", () => {
    let isClosed = false;

    const mockOnClose = () => {
      isClosed = true;
    };

    render(
      <Commentsalert
        comments={commentsList}
        onClose={mockOnClose}
        recipe_id={mockRecipeId}
        setComments={setComments}
      />
    );

    const closeButton = screen.getByText("×");
    fireEvent.click(closeButton);

    expect(isClosed).toBe(true);
  });
});
