export const getIntials = (name) => {
  if (!name) {
    return "";
  }
  const separate = name.split(" ");
  console.log(separate);
  let initials = "";
  console.log(Math.min(separate.length, 2));
  for (let i = 0; i < Math.min(separate.length, 2); i++) {
    initials += separate[i][0];
  }
  return initials.toUpperCase();
};
