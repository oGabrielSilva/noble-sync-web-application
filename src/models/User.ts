export class User {
  public readonly uid: string
  public nickname: string
  public gender: Gender
  public birthYear: number
  public bio: string = ''

  constructor(uid: string, nickname: string, gender: Gender, birthYear: number, bio: string = '') {
    this.uid = uid
    this.nickname = nickname
    this.gender = gender
    this.birthYear = birthYear
    this.bio = bio
  }
}
