import { teamHomeAway, homeAwayTeam } from '../types/types';
import IMatch from './IMatch';

interface ItPoTmatchesParameter {
  teamParameterName: teamHomeAway,
  otherTeam: homeAwayTeam,
  matchesParameter: IMatch[],
}

export default ItPoTmatchesParameter;
