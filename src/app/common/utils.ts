export class Utils {
  static isDescendantNode(
    parentNode: HTMLElement,
    target: EventTarget
  ): boolean {
    let output = false,
      childNodes = new Array<HTMLElement>();

    const prepareChildNodes = node => {
      const nodeChildNodes = Array.from(node.childNodes);
      if (nodeChildNodes.length !== 0) {
        childNodes = [
          ...childNodes,
          ...Array.prototype.slice.call(node.childNodes)
        ];

        nodeChildNodes.forEach(childNode => {
          prepareChildNodes(childNode);
        });
      }
    };

    prepareChildNodes(parentNode);

    childNodes.forEach((node: HTMLElement) => {
      if (node === target) {
        output = true;
      }
    });

    return output;
  }
}
