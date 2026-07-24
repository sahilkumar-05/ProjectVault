type ProjectForHealth = {
  description: string | null;
  problem: string | null;
  solution: string | null;
  features: any;
  erDiagram: string | null;
  systemDesign: string | null;
  flowcharts: string | null;
  installation: string | null;
  envVariables: string | null;
  apiNotes: string | null;
  documentation: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  links: any;
  challenges: string | null;
  learnings: string | null;
  futureImprovements: string | null;
  hrExplanation: string | null;
  technicalExplanation: string | null;
  commonQuestions: any;
  explanation30s: string | null;
  explanation2m: string | null;
  files?: { length: number } | any[];
};

const hasText = (v: string | null | undefined) => !!v && v.trim().length > 0;
const hasArray = (v: any) => Array.isArray(v) && v.length > 0;

export function getSectionStatus(project: ProjectForHealth) {
  return {
    overview: hasText(project.description) && hasText(project.problem) && hasText(project.solution),
    features: hasArray(project.features),
    architecture: hasText(project.erDiagram) || hasText(project.systemDesign) || hasText(project.flowcharts),
    setup: hasText(project.installation) || hasText(project.envVariables) || hasText(project.apiNotes),
    documentation: hasText(project.documentation),
    resources: hasText(project.githubUrl) || hasText(project.liveUrl) || hasArray(project.links) || (Array.isArray(project.files) && project.files.length > 0),
    devNotes: hasText(project.challenges) || hasText(project.learnings) || hasText(project.futureImprovements),
    interviewNotes:
      hasText(project.hrExplanation) ||
      hasText(project.technicalExplanation) ||
      hasArray(project.commonQuestions) ||
      hasText(project.explanation30s) ||
      hasText(project.explanation2m),
  };
}

export function getHealthScore(project: ProjectForHealth) {
  const status = getSectionStatus(project);
  const values = Object.values(status);
  const completed = values.filter(Boolean).length;
  const percentage = Math.round((completed / values.length) * 100);
  return { status, percentage, completed, total: values.length };
}