export const connectedUsers = {};
export const choices = {};
export const moves = {
  'rock':'scissor',
  'paper':'rock',
  'scissor':'papper'
}

export const initializeChoices = (roomId)=>{
  choices[roomId] = ['','']
}

export const userConnected = (userId)=>{
  connectedUsers[userId] = true;
}

export const makeMove = (roomId, player, choice)=>{
  if(choices[roomId]){
    choices[roomId][player - 1] = choice;
  }
}