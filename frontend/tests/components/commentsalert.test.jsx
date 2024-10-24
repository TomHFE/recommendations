import { render, screen, fireEvent } from "@testing-library/react";
import Commentsalert from "../../src/components/commentsalert";
import createComment from "../../src/services/recipes/createComment";

describe("Commentsalert component", () => {
  const mockComments = [{ message: "First comment" }];
  const mockRecipeId = "123";

  let commentsList = [...mockComments];

  const setComments = (updateFn) => {
    commentsList = updateFn(commentsList);
  };

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
    expect(noCommentsMessage).toBeTruthy();
  });

  test("adds a new comment on form submission", async () => {
    render(
      <Commentsalert
        comments={commentsList}
        onClose={() => {}}
        recipe_id={mockRecipeId}
        setComments={setComments}
      />
    );

    const inputElement = screen.getByPlaceholderText("Type your comment here");
    fireEvent.change(inputElement, { target: { value: "First comment" } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    expect(commentsList).toHaveLength(1);
    expect(commentsList[0].message).toBe("First comment");
  });
});
