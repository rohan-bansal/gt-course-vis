export function coursePath(fullName) {
  const [designator, number] = String(fullName ?? "").split(" ");
  if (!designator || !number) return "/";
  return `/courses/${designator}/${number}`;
}

export function oscarScheduleUrl(semester, designator, number) {
  const params = new URLSearchParams({
    term_in: semester,
    subj_in: designator,
    crse_in: number,
    schd_in: "%",
  });
  return `https://oscar.gatech.edu/pls/bprod/bwckctlg.p_disp_listcrse?${params}`;
}
