export type Line = {
  id: string;
  phoneNumber: string;
  label: string;
  labelKey?: string; // i18n key
};

// Static lines - will be replaced with API call
export const LINES: Line[] = [
  { id: "line1", phoneNumber: "+90 555 111 2233", label: "Hat 1", labelKey: "lines.line1" },
  { id: "line2", phoneNumber: "+90 555 222 3344", label: "Hat 2", labelKey: "lines.line2" },
  { id: "line3", phoneNumber: "+90 555 333 4455", label: "Hat 3", labelKey: "lines.line3" },
];

// TODO: Replace with API call
// export const getLines = async (): Promise<Line[]> => {
//   const response = await fetch('/api/lines');
//   const data = await response.json();
//   return data.lines;
// };


