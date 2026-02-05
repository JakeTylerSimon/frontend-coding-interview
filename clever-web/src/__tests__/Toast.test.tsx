import React from "react";
import { render, act, fireEvent } from "@testing-library/react";
import { ToastProvider, useToast } from "@/components/Toast";

function TestButtons() {
  const toast = useToast();
  return (
    <div>
      <button onClick={() => toast.success("Liked an Image", 3000)}>
        success
      </button>
      <button onClick={() => toast.danger("Disliked an Image", 3000)}>
        danger
      </button>
    </div>
  );
}

describe("Toast", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it("shows a toast when called", () => {
    const { getByText, getByRole } = render(
      <ToastProvider>
        <TestButtons />
      </ToastProvider>,
    );

    fireEvent.click(getByText("success"));

    expect(getByRole("status")).toHaveTextContent("Liked an Image");
  });

  it("hides and removes toast after duration", () => {
    const { getByText, queryByText } = render(
      <ToastProvider>
        <TestButtons />
      </ToastProvider>,
    );

    fireEvent.click(getByText("danger"));
    expect(getByText("Disliked an Image")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000 + 220);
    });

    expect(queryByText("Disliked an Image")).not.toBeInTheDocument();
  });
});
