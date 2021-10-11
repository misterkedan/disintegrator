import { 
	BoxGeometry, 
	CircleGeometry, 
	ConeGeometry, 
	CylinderGeometry, 
	DodecahedronGeometry, 
	IcosahedronGeometry, 
	Mesh, 
	MeshStandardMaterial, 
	OctahedronGeometry, 
	PlaneGeometry, 
	SphereGeometry, 
	TetrahedronGeometry, 
	TorusGeometry, 
	TorusKnotGeometry
} from "three";

import { settings } from "../settings";
import { stage } from "../stage";

let generator;

const geometries = {
	box: BoxGeometry,
	cicle: CircleGeometry,
	cone: ConeGeometry,
	cylinder: CylinderGeometry,
	dodeca: DodecahedronGeometry,
	icosa: IcosahedronGeometry,
	octa: OctahedronGeometry,
	plane: PlaneGeometry,
	sphere: SphereGeometry,
	tetra: TetrahedronGeometry,
	torus: TorusGeometry,
	torusKnot: TorusKnotGeometry,
}

function generate() {

	const geometry = new geometries[ settings.geometry ]();

	const material = new MeshStandardMaterial();

	if ( generator.mesh ) stage.remove( generator.mesh );

	const mesh = new Mesh( geometry, material );
	stage.add( mesh );

	generator.mesh = mesh;

}

generator = { geometries, generate };

export { generator };
