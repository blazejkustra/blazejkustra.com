import Image from "next/image";
import { projects } from "@/lib/projects";

export default function ProjectList() {
  return (
    <ul className="craft-list flex flex-col">
      {projects.map((project) => (
        <li key={project.title}>
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="craft-row flex flex-col gap-2 py-3 md:flex-row md:items-start md:gap-4"
          >
            <div className="shrink-0 pt-1 md:mr-5 md:w-[315px]">
              <h3 className="text-sm">{project.title}</h3>
              <p className="text-xs text-text-secondary mt-0.5">
                {project.meta}
              </p>
              <p className="text-xs text-text-secondary mt-1.5 hidden md:block text-pretty">
                {project.description}
              </p>
            </div>
            <div className="w-full min-w-0 md:flex-1">
              <div
                className="craft-media relative overflow-hidden rounded-lg"
                style={{ aspectRatio: project.aspect }}
              >
                {project.video ? (
                  <video
                    src={project.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : project.image ? (
                  <Image
                    src={project.image}
                    alt={`${project.title} preview`}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                ) : null}
                <div
                  className="pointer-events-none absolute inset-0 rounded-lg"
                  style={{ boxShadow: "inset 0 0 0 1px var(--hairline)" }}
                />
              </div>
              <p className="text-xs text-text-secondary mt-1.5 md:hidden">
                {project.description}
              </p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
