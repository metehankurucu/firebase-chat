const separator = "-FC-";

export const generateRoomId = (user1Id: string, user2Id: string) => {
  if (!user1Id || !user2Id) return null;
  return `${user1Id}${separator}${user2Id}`;
};

export const getUserIdsFromRoomId = (roomId: string) => {
  if (!roomId || !roomId.includes(separator)) return null;
  const splittedRoomId = roomId.split(separator);
  if (splittedRoomId.length !== 2) return null;
  return splittedRoomId;
};
