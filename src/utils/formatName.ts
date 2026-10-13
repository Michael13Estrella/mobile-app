const capitalize = (part: string): string =>
  part.charAt(0).toUpperCase() + part.slice(1);

// Display form of a person's name sent in capitals by the server:
// "JUAN DELA CRUZ" -> "Juan Dela Cruz", "MARY-ANN O'NEIL" -> "Mary-Ann O'Neil".
// For display only: keep the original when sending names back to the API.
export const formatPersonName = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .map((word) =>
      word
        .toLowerCase()
        .split("-")
        .map((part) => part.split("'").map(capitalize).join("'"))
        .join("-"),
    )
    .join(" ");
