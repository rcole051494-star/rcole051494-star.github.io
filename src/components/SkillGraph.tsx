import { useEffect, useRef } from 'preact/hooks';
import * as d3 from 'd3-force';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: 'skill' | 'tool' | 'framework' | 'case';
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
}

interface Props {
  nodes: Node[];
  links: Link[];
}

export default function SkillGraph({ nodes: initialNodes, links: initialLinks }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = containerRef.current.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const width = rect.width;
    const height = rect.height;

    // Clone data for D3 mutation
    const nodes = initialNodes.map(d => ({ ...d }));
    const links = initialLinks.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(20));

    // Get CSS tokens
    const rootStyle = getComputedStyle(document.documentElement);
    const colorInk = rootStyle.getPropertyValue('--ink').trim() || '#0E0E10';
    const colorSignal = rootStyle.getPropertyValue('--signal').trim() || '#FF4A1C';
    const colorRule = rootStyle.getPropertyValue('--rule').trim() || 'rgba(14,14,16,0.18)';

    simulation.on("tick", () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw edges
      ctx.beginPath();
      links.forEach((link: any) => {
        ctx.moveTo(link.source.x, link.source.y);
        ctx.lineTo(link.target.x, link.target.y);
      });
      ctx.strokeStyle = colorRule;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw nodes
      nodes.forEach((node: any) => {
        ctx.beginPath();
        const radius = node.group === 'case' ? 6 : 4;
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = node.group === 'case' ? colorSignal : colorInk;
        ctx.fill();

        if (node.group === 'case') {
            ctx.strokeStyle = colorInk;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw labels
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = colorInk;
        ctx.fillText(node.id, node.x + 10, node.y + 3);
      });
    });

    return () => simulation.stop();
  }, [initialNodes, initialLinks]);

  return (
    <div ref={containerRef} class="w-full h-full min-h-[500px] relative">
      <canvas ref={canvasRef} class="absolute inset-0 pointer-events-none" />
      <div class="absolute bottom-4 left-4 font-mono text-[9px] text-[var(--ink)]/50">
        Interactive Force Graph • d3-force
      </div>
    </div>
  );
}
