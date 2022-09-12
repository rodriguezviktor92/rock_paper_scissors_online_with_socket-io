export const connectedUsers = {};
export const choices = {};
export const moves = {
  'rock':'scissor',
  'paper':'rock',
  'scissor':'paper'
}

export const initializeChoices = (roomId)=>{
  choices[roomId] = {choices: ['',''] };
}

export const userConnected = (userId)=>{
  connectedUsers[userId] = true;
}

export const makeMove = (roomId, player, choice)=>{
  if(choices[roomId].choices){
    choices[roomId].choices[player - 1] = choice;
  }
}