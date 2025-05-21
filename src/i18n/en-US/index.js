// This is just an example,
// so you can safely delete all default props below

export default {
  failed: 'Action failed',
  success: 'Action was successful',

  save: 'Save',
  cancel: 'Cancel',
  ok: 'OK',
  close: "Close",

  username: 'Username',
  password: 'Password',

  copy: "Copy",
  paste: "Paste",
  selectPaste: "Select Paste",

  edit: 'Edit',
  add: 'Add',
  update: 'Update',
  delete: 'Delete',
  search: 'Search',
  reset: 'Reset',
  refresh: 'Refresh',
  connect: 'Connect',
  upload: 'Upload',
  download: 'Download',
  select: 'Select',
  selectAll: 'Select All',
  selectNone: 'Select None',
  selectInvert: 'Select Invert',
  selectFile: 'Select File',
  selectFolder: 'Select Folder',
  mark: "mark",

  confirm: "Confirm",

  selectLanguage: 'Select Language',


  //
  settings: "Settings",
  management: "Management",

  //navi
  navigator: {
    home: "Home",
    nodes: "Nodes",
    nodesMg: "Nodes Management",
    dockerNode: "Docker Node",
    terminal: "Terminal Node",
    settings: "Settings"
  },

  verifyMessage: {
    dataNotNull: "Not Null",
    dataLenNotMax: "The data length cannot exceed:",
    dataLenNotMin: "The data length cannot be less than:",
  },

  // Node
  node: {
    addServiceTitle: "Add Docker/Podman Service",
    editServiceTitle: "Edit Docker/Podman Service",
    serviceManagement: "Service Management",
    addService: "Add Service",
    local: "local",
    remote: "remote",
    localNode: "local node",
    remoteNode: "remote node",
    dockerPanel: "docker panel",

    serviceName: "Service Name",
    serviceType: "Service Type",
    connectionType: "Link Type",
    protocol: "Protocol",
    address: "Address",
    port: "Port",
    serviceStatus: "Service Status",
    action: "Action",
    mark: "Mark",

    addNode: "Add Node",
    nodeName: "Node Name",
    authType: "Auth Type",
    password: 'password',
    key: 'Key',
    selectKeyFile: "Select key file",
    keyFileHint: "Key hidden",

    nodeUrl: "Node URL",
    nodePort: "Node Port",
    nodeUserName: "Node User Name",
    nodePassword: "Node Password",
    nodeDescription: "Node Description",
    nodeStatus: "Node Status",
    nodeStatusOnline: "Online",
    nodeStatusOffline: "Offline",
    nodeStatusError: "Error",

    portRange: "Port Range",

    connectMessage: "Do you want to make this connection?",
    connectError: "Required connection parameters are missing",
    connectError1: "Failed to find route",
    deleteMessage: "Are you sure to delete?",
    fileReadError: "File Read Error",
  },

  //Docker Node
  dockerNode: {
    addServiceTitle: "Add Docker/Podman Service",
    editServiceTitle: "Edit Docker/Podman Service",
    serviceManagement: "Service Management",
    addService: "Add Service",
    local: "local",
    remote: "remote",
    localNode: "local node",
    remoteNode: "remote node",

    serviceName: "Service Name",
    serviceType: "Service Type",
    connectionType: "Link Type",
    address: "Address",
    port: "Port",
    serviceStatus: "Service Status",
    action: "Action",
    mark: "Mark",

    addNode: "Add Node",
    nodeName: "Node Name",
    nodeUrl: "Node URL",
    nodePort: "Node Port",
    nodeUserName: "Node User Name",
    nodePassword: "Node Password",
    nodeDescription: "Node Description",
    nodeStatus: "Node Status",
    nodeStatusOnline: "Online",
    nodeStatusOffline: "Offline",
    nodeStatusError: "Error",

    connectMessage: "Do you want to make this connection?",
    connectError: "Required connection parameters are missing",
    deleteMessage: "Are you sure to delete?"
  },

  terminal: {
    globalSettingsTitle: "Terminal Node Global Settings",

    closeMessage: "Are you sure to close？",
  },

  xterm: {

    termInitError: "Terminal init error",

    nodePtyInitError: "node-pty uninitialized",

  },

  cmdBar: {
    addCmdGroup: "Add CMD Group",
    editCmdGroup: "Edit CMD Group",
    groupName: "Group Name",

    label: "Label",
    sendString: "Cmd String",
    mark: "Mark",

    addCmd: "Add CMD",
    editCmd: "Edit CMD",

    deleteMessage: "Are you sure to delete?",

  },

  filesystem: {
    title: "File System",

    name: "Name",
    attr: "Attribute",
    modifyTime: "Modified Time",
    size: "Size",
    action: "Action",

    parentFolder: "Parent Folder",
    createFolder: "Create Folder",
    createFile: "Create File",
    uploadFolder: "Upload Folder",
    uploadFile: "Upload File",
    refresh: "Refresh",
    batchDelete: "Batch Delete",
    fullscreen: "Fullscreen",
    fullWidth: "FullWidth",
    rename: "Rename",

    termInitError: "Init error",
  },

  // db
  database: {
    initError: '',
    initSuccess: 'Database initialized successfully',
    initTableError: 'Failed to initialize table',
    initTableSuccess: 'Table initialized successfully',
    connectionError: 'Database connection failed',
    connectionSuccess: 'Database connected successfully',

    accessSuccess: 'Access successfully',
    accessFail: 'Access failed',
    addSuccess: 'Added successfully',
    addFail: 'Added failed',
    writeSuccess: 'Write successfully',
    writeError: 'Write failed',
    updateSuccess: 'Update successfully',
    updateError: 'Update failed',
    deleteSuccess: 'Delete successfully',
    deleteFail: 'Delete failed',
  },

}
