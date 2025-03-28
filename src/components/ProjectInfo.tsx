import { Project } from '../types';

interface ProjectInfoProps {
  project: Project;
}

export const ProjectInfo = ({ project }: ProjectInfoProps) => {
  return (
    <div className="card p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-dark mb-1">{project.name}</h2>
          <p className="text-sm text-dark-light">Kategori: {project.category}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-dark-light">Upphandlingen ska vara klar:</p>
          <p className="font-medium text-dark">
            {new Date(project.deadline).toLocaleDateString('sv-SE')}
          </p>
        </div>
      </div>
      
      <div className="bg-neutral-light/20 rounded-lg p-4">
        <p className="text-sm font-medium text-dark mb-1">Status</p>
        <p className="text-dark">
          {project.status === 'evaluating' ? 'Utvärdering pågår' :
           project.status === 'completed' ? 'Avslutad' : 'Aktiv'}
        </p>
      </div>
    </div>
  );
}; 