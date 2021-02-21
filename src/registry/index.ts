import { FhirVersion, CapabilityRegistry, ResourceCapabilityStatement } from 'fhir-works-on-aws-interface';
import { FhirStructureDefinition } from "../implementationGuides";

/**
 * This class is the single authority over the supported FHIR StructuredDefinition and their definitions
 */
export class FHIRStructureDefinitionRegistry implements CapabilityRegistry {
    private readonly capabilityStatement: ResourceCapabilityStatement;

    constructor(fhirVersion: FhirVersion, compiledImplementationGuides?: any[]) {
        let compiledStructureDefinitions: FhirStructureDefinition[] = [];

        if (compiledImplementationGuides !== undefined) {
            compiledStructureDefinitions = [...compiledImplementationGuides];
        }

        this.capabilityStatement = {};

        compiledStructureDefinitions.forEach(compiledStructureDefinition => {
            const structuredDefinition = this.capabilityStatement[compiledStructureDefinition.name];

            if (structuredDefinition) {
                this.capabilityStatement[compiledStructureDefinition.name].supportedProfile.push(compiledStructureDefinition.url);
            }
            else {
                this.capabilityStatement[compiledStructureDefinition.name] = {
                    type: compiledStructureDefinition.type,
                    supportedProfile: [compiledStructureDefinition.url]
                };
            }
        });
    }

    /**
     * Retrieve the profiles for a given resource type. Returns undefined if the parameter is not found on the registry.
     * @param resourceType FHIR resource type
     * @return a list of profiles
     */
    getProfiles(resourceType: string): string[] {
        return this.capabilityStatement[resourceType]?.supportedProfile ?? [];
    }

    /**
     * Retrieve a subset of the CapabilityStatement with the resource definitions
     * See https://www.hl7.org/fhir/capabilitystatement.html
     */
    getCapabilities(): ResourceCapabilityStatement {
        return this.capabilityStatement;
    }
}