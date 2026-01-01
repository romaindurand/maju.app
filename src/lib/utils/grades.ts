import tinygradient from 'tinygradient';

/**
 * Get the color for a grade based on its index
 * @param totalGrades - The total number of grades in the scale
 * @param gradeIndex - The index of the grade (0-based)
 * @returns The hex color string for the grade
 */
export function getGradeColor(totalGrades: number, gradeIndex: number): string {
  const gradient = tinygradient(['#dc2626', '#55CC00']);
  const tinycolors = gradient.hsv(totalGrades, false);
  const colors = tinycolors.map((t: any) => t.toHexString());
  return colors[gradeIndex] || '#6b7280';
}
