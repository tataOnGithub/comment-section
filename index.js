import {vote} from "./data.js";
import {addComment} from "./data.js";
import {findUser} from "./data.js";
import {sortComments} from "./data.js";
import {addReply} from "./data.js";
import {getUser} from "./data.js";
import {deleteComment} from "./data.js";
import {editComment} from "./data.js";
import {dataTolocalStorage} from "./data.js";

const container = document.getElementById("container");
const commentsWrapper = document.createElement("div");
container.appendChild(commentsWrapper);

function createComment() {
  const newCommentDiv = document.createElement('div');
  newCommentDiv.classList.add("new-comment-div");
  const myUserImage = document.createElement('img');
  myUserImage.classList.add("new-comment-img");
  myUserImage.src = getUser().image.png;
  newCommentDiv.appendChild(myUserImage);
  const textareaVal = document.createElement("textarea");
  newCommentDiv.appendChild(textareaVal);
  const newCommentBtn = document.createElement("button");
  newCommentDiv.appendChild(newCommentBtn);
  newCommentBtn.textContent = "SEND";
  commentsWrapper.appendChild(newCommentDiv);

  newCommentBtn.addEventListener("click", () => {
    const value = textareaVal.value;
    if (value) {
      addComment(value);
    } else {
      return;
    }
    render();
  });
}

function createReply(parentElement, id) {
  const replayWrapper = document.createElement("div");
  replayWrapper.classList.add("update-comment-text");
  const replayWrapperChild = document.createElement("div");
  replayWrapperChild.classList.add("update-comment-text-child");
  const myUserReplyImage = document.createElement('img');
  myUserReplyImage.classList.add("new-comment-img");
  myUserReplyImage.src = getUser().image.png;
  const replyTextArea = document.createElement("textarea");
  replyTextArea.innerHTML = `@${findUser(id)} `;
  const replyButton = document.createElement("button");
  replyButton.innerHTML = "REPLY";
  replayWrapperChild.appendChild(myUserReplyImage);
  replayWrapperChild.appendChild(replyTextArea);
  replayWrapperChild.appendChild(replyButton);
  replayWrapper.appendChild(replayWrapperChild);
  parentElement.appendChild(replayWrapper);

  replyButton.addEventListener("click", function () {
    const value = replyTextArea.value;

    if (value) {
      addReply(id, value, "gvantsa");
    } else {
      return;
    }  
    render();
  });
}

function updateComment(parentElement, id) {
  const commentContent = parentElement.querySelector(".comment-text");
  const updateCommentContainer = document.createElement("div");
  updateCommentContainer.classList.add("update-comment-text");
  const itemsWrapper = document.createElement("div");
  itemsWrapper.classList.add('update-comment-wrapper');
  const myUserUpdateImage = document.createElement('img');
  myUserUpdateImage.classList.add("new-comment-img");
  myUserUpdateImage.src = getUser().image.png;
  const editTextarea = document.createElement("textarea");
  editTextarea.value = commentContent.innerHTML;
  const editBtn = document.createElement("button");
  editBtn.innerHTML = "EDIT";
  itemsWrapper.appendChild(myUserUpdateImage);
  itemsWrapper.appendChild(editTextarea);
  itemsWrapper.appendChild(editBtn);
  updateCommentContainer.appendChild(itemsWrapper);
  commentContent.remove();
  parentElement.appendChild(updateCommentContainer);

  editBtn.addEventListener("click", function () {
    if (editTextarea.value) {
      editComment(id, editTextarea.value);
    } else {
      return;
    }
    render();
  });
}

function render() {
  commentsWrapper.innerHTML = "";
  sortComments().forEach((x) => {
    const commentEl = oneCommentSection(x);
    commentsWrapper.appendChild(commentEl);

    if (x.replies.length) {
      x.replies.forEach((reply) => {
        const replyEl = oneCommentSection(reply);
        replyEl.classList.add("comment-reply");
        commentsWrapper.appendChild(replyEl);
      });
    }
  });
  createComment();
  dataTolocalStorage();
}

function oneCommentSection(data) {
  const elOfComment = document.createElement("div");
  elOfComment.classList.add("comment");
  elOfComment.innerHTML = `
    <div class="comment-votes">
      <button id="increment">+</button>
      <span>${data.score}</span>
      <button id="decrement">-</button>
    </div>
    <div class="comments-container">
      <div class="comment-header">
        <div class="user">
          <img src="${data.user.image.png}">          
          <p><strong>${data.user.username}</strong></p>
          <p>${data.createdAt}</p>
        </div>
        <div>
          ${
            data.user.username === getUser().username
            ? `<img src='./images/icon-edit.svg'> <button class='edit'>Edit</button> <img src='./images/icon-delete.svg'> <button class='delete'>Delete</button>`
            : `<img src='./images/icon-reply.svg'> <button class="reply">Reply</button>`
          }
        </div>
      </div>
      <p class="comment-text">${data.content}</p>
    </div>
  `;

  elOfComment.addEventListener("click", function (event) {
    if (event.target.id === "increment") {
      vote(data.id, "up");
      render();
    } else if (event.target.id === "decrement") {
      vote(data.id, "down");
      render();
    }
    if (Array.from(event.target.classList).includes("reply")) {
      createReply(elOfComment, data.id);
      return;
    }
    if (Array.from(event.target.classList).includes("edit")) {
      updateComment(elOfComment, data.id);
    }
    if (Array.from(event.target.classList).includes("delete")) {
      deleteComment(data.id);
      render();
    }
  });

  return elOfComment;
}

render();