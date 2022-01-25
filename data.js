import jsonData from "../data.json" assert {type: 'json'};
let dataFromJson = JSON.parse(JSON.stringify(jsonData));
let data = null;
const LOCAL_STORAGE_KEY = "saved comments";
const createNewId = Date.now();
export const getUser = () => data.currentUser;


export function findUser(id) {
  let nameOfUser = "";
  const tryFind = dataFromJson.comments.filter(x => {
    if (x.id==id) {
      nameOfUser = x.user.username;
    } 
    if (x.replies.length) {
      x.replies.filter(reply => {
        if (reply.id==id) {
          nameOfUser = reply.user.username;
        }
      })
    }
  });
  return nameOfUser;
}

function defineTargetComment(id, hasParent = false) {
  let item = null;

  data.comments.find(comment => {
    if (comment.id === id) {
      item = comment;
    }

    if (comment.replies.length) {
      comment.replies.find(reply => {
        if (reply.id === id) {
          if (hasParent) {
            item = comment;
          } else {
            item = reply;
          }
        }
      })
    }
  })
  return item;
}

export const sortComments = () => {
  data.comments.sort((a, b) => (b.score - a.score));
  return data.comments;
};

export function dataTolocalStorage() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

const comments = localStorage.getItem(LOCAL_STORAGE_KEY);
if (comments) {
  data = JSON.parse(comments);
} else {
  data = jsonData;
}

export const addComment = (content) => {
  const date = new Date();
  const comment = {
    id: createNewId,
    content,
    createdAt: `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    score: 0,
    user: getUser(),
    replies: [],
  };

  data.comments.push(comment);
};

export const addReply = (id, content, replyingTo) => {
  const date = new Date();
  const comment = {
    id: createNewId,
    content,
    createdAt: `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    score: 0,
    user: getUser(),
    replyingTo,
  };
  let parentComment = defineTargetComment(id, true);

  if (!parentComment) return;
  parentComment.replies.unshift(comment);
};

export const editComment = (id, content) => {
  let found = defineTargetComment(id);
  if (!found) return;
  found.content = content;
};

export const vote = (id, type) => {
  let found = defineTargetComment(id);
  if (!found) return;
  if (type === "up") found.score++;
  else found.score--;
};

export const deleteComment = (id) => {
  for (let i = 0; i < data.comments.length; i++) {
    const comment = data.comments[i];

    if (comment.id === id) {
      data.comments.splice(i, 1);
      return;
    }

    if (comment.replies.length) {
      for (let j = 0; j < comment.replies.length; j++) {
        const reply = comment.replies[j];
        if (reply.id === id) {
          comment.replies.splice(j, 1);
          return;
        }
      }
    }
  }
};

