import ReactReconciler from "react-reconciler";

type Type = string;
type Props = { [key: string]: any };
type Container = HTMLElement;
type Instance = HTMLElement;
type TextInstance = Text;
type HydratableInstance = unknown;
type PublicInstance = unknown;
type HostContext = { [key: string]: any };
type UpdatePayload = unknown;
type ChildSet = unknown;
type TimeoutHandle = number;
type NoTimeout = 0;
type OpaqueHandle = ReactReconciler.OpaqueHandle;
type FiberRoot = ReactReconciler.FiberRoot;

const rootHostContext: HostContext = {};
const childHostContext: HostContext = {};

// eslint-disable-next-line max-len
const hostConfig: ReactReconciler.HostConfig<Type, Props, Container, Instance, TextInstance, HydratableInstance, PublicInstance, HostContext, UpdatePayload, ChildSet, TimeoutHandle, NoTimeout> & {
  [key: string]: any;
} = {
  getPublicInstance: (
    _instance: Instance | TextInstance,
  ) => null as PublicInstance,

  getRootHostContext: (
    _rootContainerInstance: Container,
  ) => {
    console.trace("getRootHostContext");
    return rootHostContext;
  },

  getChildHostContext: (
    _parentHostContext: HostContext,
    _type: Type,
    _rootContainerInstance: Container,
  ) => {
    console.trace("getChildHostContext");
    return childHostContext;
  },

  prepareForCommit: (_containerInfo: Container) => {
    console.trace("prepareForCommit");
  },

  resetAfterCommit: (_containerInfo: Container) => {
    console.trace("resetAfterCommit");
  },

  /**
   * This is where react-reconciler wants to create an instance of UI element in terms of the target.
   * Since our target here is the DOM, we will create document.createElement and type is the argument
   * that contains the type string like div or img or h1 etc.
   * The initial values of domElement attributes can be set in this function from the newProps argument.
   */
  createInstance: (
    type: Type,
    newProps: Props,
    _rootContainerInstance: Container,
    _hostContext: HostContext,
    _internalInstanceHandle: OpaqueHandle,
  ) => {
    console.trace("createInstance");

    const domElement = document.createElement(type);
    Object.keys(newProps).forEach((propName) => {
      const propValue = newProps[propName];
      if (propName === "children") {
        if (typeof propValue === "string") {
          domElement.textContent = propValue;
        } else if (typeof propValue === "number") {
          domElement.textContent = propValue.toString();
        }
      } else if (propName === "onClick") {
        domElement.addEventListener("click", propValue);
      } else if (propName === "className") {
        domElement.setAttribute("class", propValue);
      } else {
        domElement.setAttribute(propName, propValue);
      }
    });
    return domElement;
  },

  appendInitialChild: (
    parentInstance: Instance,
    child: Instance,
  ) => {
    console.trace("appendInitialChild");
    parentInstance.appendChild(child);
  },

  finalizeInitialChildren: (
    _parentInstance: Instance,
    _type: Type,
    _props: Props,
    _rootContainerInstance: Container,
    _hostContext: HostContext,
  ) => {
    console.trace("finalizeInitialChildren");
    return false;
  },

  prepareUpdate: (
    _instance: Instance,
    _type: Type,
    _oldProps: Props,
    _newProps: Props,
    _rootContainerInstance: Container,
    _hostContext: HostContext,
  ) => {
    console.trace("prepareUpdate");
    return true as null | UpdatePayload;
  },

  shouldSetTextContent: (_type: Type, props: Props) => {
    console.trace("shouldSetTextContent");
    return typeof props.children === "string" || typeof props.children === "number";
  },

  shouldDeprioritizeSubtree: (_type: Type, _oldProps: Props) => false,

  createTextInstance: (
    text: string,
    _rootContainerInstance: Container,
    _hostContext: HostContext,
    _internalInstanceHandle: OpaqueHandle,
  ) => {
    console.trace("createTextInstance");
    return document.createTextNode(text);
  },

  scheduleDeferredCallback: (_callback: () => any, _options?: { timeout: number }) => null as any,
  cancelDeferredCallback: (_callbackID: any) => { },

  setTimeout: window.setTimeout,
  clearTimeout: window.clearTimeout,
  noTimeout: 0,

  now: Date.now,

  isPrimaryRenderer: true,

  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,

  clearContainer: (containerInfo: Container) => {
    console.trace("clearContainer");
    let lastNode: ChildNode | null = null;
    while (lastNode = containerInfo.lastChild) lastNode.remove(); // eslint-disable-line no-cond-assign
  },

  appendChildToContainer: (parent: HTMLElement, node: HTMLElement) => {
    console.trace("appendChildToContainer");
    parent.appendChild(node);
  },
};

const ReconcilerInstance = ReactReconciler(hostConfig);

export default {
  render: (element: any, containerInfo: HTMLElement & { _rootContainer?: FiberRoot }) => {
    /* eslint-disable no-underscore-dangle */

    // Create a root Container if it doesn't exist
    if (!containerInfo._rootContainer) {
      containerInfo._rootContainer = ReconcilerInstance.createContainer(
        containerInfo,
        false,
        false,
      );
    }

    // update the root Container
    return ReconcilerInstance.updateContainer(
      element,
      containerInfo._rootContainer,
      null,
      () => null,
    );

    /* eslint-enable no-underscore-dangle */
  },

};
