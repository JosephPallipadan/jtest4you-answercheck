import type { PlasmoContentScript } from "plasmo";

export const config: PlasmoContentScript = {
  matches: ["https://japanesetest4you.com/*"],
  all_frames: true
};

window.addEventListener("load", () => {
  const answerKeyElement = Array.from(
    document.getElementsByTagName("strong")
  ).filter((element) => element.textContent.includes("Answer Key"))[0];

  const answerKeyParagraphElement = [
    ...document.getElementsByTagName("br")
  ].filter((element) =>
    element.parentElement.textContent.match(/Question (\d+): (\d)/g)
  )[0].parentElement;

  const answers = [
    ...answerKeyParagraphElement.textContent.matchAll(/Question (\d+): (\d)/g)
  ];
  const answerMap = new Map(answers.map((answer) => [answer[1], answer[2]]));

  const inputElements = [...document.getElementsByTagName("input")].filter(
    (element) => element.name.startsWith("quest")
  );

  const checkAnswersButton = document.createElement("button");
  checkAnswersButton.id = "check-answers-button";
  checkAnswersButton.textContent = "Check Answers";
  checkAnswersButton.addEventListener("click", () => {
    let numCorrect = 0;

    inputElements.forEach((element) => {
      const questionNumber = element.name.replace("quest", "");
      const answer = answerMap.get(questionNumber);
      console.log({ questionNumber, answer, value: element.value });

      if (element.checked) {
        if (element.value === answer) {
          numCorrect++;
        } else {
          element.insertAdjacentText("afterend", "❌");
        }
      }

      if (element.value === answer) {
        element.insertAdjacentText("afterend", "✅");
      }
    });

    checkAnswersButton.innerText = `Check Answers ${numCorrect}/${answers.length}`;
  });

  if (document.getElementById("check-answers-button") === null) {
    answerKeyElement.parentElement.insertAdjacentElement(
      "beforebegin",
      checkAnswersButton
    );
  }
});
