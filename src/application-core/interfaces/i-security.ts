import EmployedRequest from '../wrapper/employed-request';

export default interface ISecurity {
  GetUserData: (token: string) => Promise<EmployedRequest>;
}
