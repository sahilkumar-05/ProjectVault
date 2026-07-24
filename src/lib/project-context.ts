export function buildProjectContext(project: any): string {
  const parts: string[] = [];

  parts.push(`Project Name: ${project.name}`);
  if (project.description) parts.push(`Description: ${project.description}`);
  if (project.problem) parts.push(`Problem it solves: ${project.problem}`);
  if (project.solution) parts.push(`Solution: ${project.solution}`);
  if (project.techStack?.length) parts.push(`Tech Stack: ${project.techStack.join(", ")}`);

  if (project.features?.length) {
    parts.push(`Features:\n${project.features.map((f: any) => `- ${f.title}: ${f.description}`).join("\n")}`);
  }

  if (project.erDiagram) parts.push(`ER Diagram (Mermaid):\n${project.erDiagram}`);
  if (project.systemDesign) parts.push(`System Design (Mermaid):\n${project.systemDesign}`);
  if (project.flowcharts) parts.push(`Flowcharts (Mermaid):\n${project.flowcharts}`);

  if (project.installation) parts.push(`Installation:\n${project.installation}`);
  if (project.envVariables) parts.push(`Environment Variables:\n${project.envVariables}`);
  if (project.apiNotes) parts.push(`API Notes:\n${project.apiNotes}`);

  if (project.documentation) parts.push(`Documentation:\n${project.documentation}`);

  if (project.githubUrl) parts.push(`GitHub: ${project.githubUrl}`);
  if (project.liveUrl) parts.push(`Live URL: ${project.liveUrl}`);

  if (project.challenges) parts.push(`Challenges faced:\n${project.challenges}`);
  if (project.learnings) parts.push(`Learnings:\n${project.learnings}`);
  if (project.futureImprovements) parts.push(`Future improvements:\n${project.futureImprovements}`);

  if (project.hrExplanation) parts.push(`HR Explanation:\n${project.hrExplanation}`);
  if (project.technicalExplanation) parts.push(`Technical Explanation:\n${project.technicalExplanation}`);

  return parts.join("\n\n");
}