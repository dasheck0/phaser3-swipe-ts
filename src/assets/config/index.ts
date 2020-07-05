import * as YAML from 'yamljs';
import { EnvironmentDto } from '../../../src/dtos/Environment.dto'

const config: EnvironmentDto = YAML.load(`assets/config/development.yml`);

export default config;