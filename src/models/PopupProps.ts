export class PopupModel {
  public readonly title
  public readonly isVisible
  public readonly onConfirm

  constructor(title = '', isVisible = false, onConfirm = () => {}) {
    this.title = title
    this.isVisible = isVisible
    this.onConfirm = onConfirm
  }
}
