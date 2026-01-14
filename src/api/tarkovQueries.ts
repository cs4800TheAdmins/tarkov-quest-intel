export const CUSTOMS_MARKERS_QUERY = `
{
    maps(name: "customs") {
        id
        name
        normalizedName

        extracts {
            id
            name
            switches {
                id
                name
                switchType
            }
            position { x y z }
        }

        spawns {
            zoneName
            sides
            categories
            position { x y z }
        }

        transits {
            id
            description
            map { name }
            position { x y z }
        }

        locks {
            lockType
            needsPower
            key { id name }
            position { x y z }
        }

        hazards {
            hazardType
            name
            position { x y z }
        }
    }
}
`;