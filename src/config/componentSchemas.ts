import { ComponentDefinition, ComponentType } from '../types';

export const componentDefinitions: Record<ComponentType, ComponentDefinition> = {
  button: {
    type: 'button',
    name: 'Button',
    icon: 'MousePointerClick',
    defaultProps: {
      label: 'Button',
      tooltip: '',
      visible: true,
      disabled: false,
      loading: false,
      variant: 'primary',
      size: 'md',
      actions: {
        onClick: {
          type: 'none'
        }
      }
    },
    defaultStyle: {
      backgroundColor: 'transparent',
      border: 'none'
    },
    defaultSize: { width: 120, height: 40 },
    category: 'basic',
    propertySchema: [
      { key: 'label', label: 'Label', type: 'text', defaultValue: 'Button' },
      { key: 'tooltip', label: 'Tooltip', type: 'text' },
      { key: 'visible', label: 'Visible', type: 'boolean', defaultValue: true },
      { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
      { key: 'loading', label: 'Loading', type: 'boolean', defaultValue: false },
      { key: 'variant', label: 'Variant', type: 'select', options: ['primary', 'secondary', 'danger', 'success', 'warning', 'info'], defaultValue: 'primary' },
      { key: 'size', label: 'Size', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'], defaultValue: 'md' }
    ]
  },
  input: {
    type: 'input',
    name: 'Input',
    icon: 'Type',
    defaultProps: {
      label: 'Input',
      placeholder: 'Enter text...',
      value: '',
      type: 'text',
      disabled: false,
      readonly: false,
      required: false,
      visible: true,
      validation: {},
      maxLength: 100,
      showCharacterCount: false
    },
    defaultStyle: {
      backgroundColor: 'transparent'
    },
    defaultSize: { width: 250, height: 75 },
    category: 'form',
    propertySchema: [
      { key: 'label', label: 'Label', type: 'text', defaultValue: 'Input' },
      { key: 'placeholder', label: 'Placeholder', type: 'text' },
      { key: 'type', label: 'Type', type: 'select', options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'], defaultValue: 'text' },
      { key: 'visible', label: 'Visible', type: 'boolean', defaultValue: true },
      { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
      { key: 'readonly', label: 'Read Only', type: 'boolean', defaultValue: false },
      { key: 'required', label: 'Required', type: 'boolean', defaultValue: false },
      { key: 'maxLength', label: 'Max Length', type: 'number', defaultValue: 100 },
      { key: 'showCharacterCount', label: 'Show Character Count', type: 'boolean', defaultValue: false }
    ]
  },
  text: {
    type: 'text',
    name: 'Text',
    icon: 'Type',
    defaultProps: {
      content: 'Text',
      richText: false,
      fontSize: '14px',
      fontWeight: 'normal',
      color: '#000000',
      textAlign: 'left',
      visible: true
    },
    defaultStyle: {},
    defaultSize: { width: 200, height: 40 },
    category: 'basic',
    propertySchema: [
      { key: 'content', label: 'Content', type: 'textarea', defaultValue: 'Text' },
      { key: 'fontSize', label: 'Font Size', type: 'text', defaultValue: '14px' },
      { key: 'fontWeight', label: 'Font Weight', type: 'select', options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'], defaultValue: 'normal' },
      { key: 'color', label: 'Color', type: 'color', defaultValue: '#000000' },
      { key: 'textAlign', label: 'Text Align', type: 'select', options: ['left', 'center', 'right', 'justify'], defaultValue: 'left' },
      { key: 'visible', label: 'Visible', type: 'boolean', defaultValue: true },
      { key: 'richText', label: 'Rich Text', type: 'boolean', defaultValue: false }
    ]
  },
  image: {
    type: 'image',
    name: 'Image',
    icon: 'Image',
    defaultProps: {
      src: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
      alt: 'Image',
      fit: 'cover',
      visible: true,
      borderRadius: '0px',
      opacity: 1,
      clickAction: {
        type: 'none'
      }
    },
    defaultStyle: {},
    defaultSize: { width: 300, height: 200 },
    category: 'basic',
    propertySchema: [
      { key: 'src', label: 'Source URL', type: 'url', defaultValue: '' },
      { key: 'alt', label: 'Alt Text', type: 'text', defaultValue: 'Image' },
      { key: 'fit', label: 'Fit Mode', type: 'select', options: ['cover', 'contain', 'fill', 'scale-down', 'none'], defaultValue: 'cover' },
      { key: 'borderRadius', label: 'Border Radius', type: 'text', defaultValue: '0px' },
      { key: 'opacity', label: 'Opacity', type: 'number', defaultValue: 1 },
      { key: 'visible', label: 'Visible', type: 'boolean', defaultValue: true }
    ]
  },
  table: {
    type: 'table',
    name: 'Table',
    icon: 'Table',
    defaultProps: {
      columns: [
        { key: 'id', name: 'ID', type: 'number', visible: true, sortable: true, filterable: false, width: 60 },
        { key: 'name', name: 'Name', type: 'text', visible: true, sortable: true, filterable: true, width: 150 },
        { key: 'email', name: 'Email', type: 'text', visible: true, sortable: true, filterable: true, width: 200 },
        { key: 'role', name: 'Role', type: 'badge', visible: true, sortable: true, filterable: true, width: 100 },
        { key: 'status', name: 'Status', type: 'badge', visible: true, sortable: false, filterable: true, width: 100 }
      ],
      dataSource: 'static',
      data: [],
      pagination: {
        enabled: true,
        pageSize: 10,
        showPageSizeOptions: true,
        pageSizeOptions: [5, 10, 20, 50, 100]
      },
      sorting: {
        enabled: true,
        defaultSort: 'id',
        defaultOrder: 'asc'
      },
      filtering: {
        enabled: true,
        searchPlaceholder: 'Search...'
      },
      selection: {
        mode: 'multiple',
        showSelectAll: true
      },
      rowActions: [],
      visible: true,
      compact: false,
      striped: true,
      bordered: false,
      hoverable: true
    },
    defaultStyle: {},
    defaultSize: { width: 800, height: 400 },
    category: 'data',
    propertySchema: [
      { key: 'visible', label: 'Visible', type: 'boolean', defaultValue: true },
      { key: 'compact', label: 'Compact', type: 'boolean', defaultValue: false },
      { key: 'striped', label: 'Striped', type: 'boolean', defaultValue: true },
      { key: 'bordered', label: 'Bordered', type: 'boolean', defaultValue: false },
      { key: 'hoverable', label: 'Hoverable', type: 'boolean', defaultValue: true }
    ]
  },
  select: {
    type: 'select',
    name: 'Select',
    icon: 'ChevronDown',
    defaultProps: {
      label: 'Select',
      placeholder: 'Choose an option...',
      value: '',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ],
      multiple: false,
      searchable: true,
      clearable: true,
      disabled: false,
      required: false,
      visible: true,
      loading: false
    },
    defaultStyle: {},
    defaultSize: { width: 250, height: 75 },
    category: 'form',
    propertySchema: [
      { key: 'label', label: 'Label', type: 'text', defaultValue: 'Select' },
      { key: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: 'Choose an option...' },
      { key: 'visible', label: 'Visible', type: 'boolean', defaultValue: true },
      { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
      { key: 'required', label: 'Required', type: 'boolean', defaultValue: false },
      { key: 'multiple', label: 'Multiple', type: 'boolean', defaultValue: false },
      { key: 'searchable', label: 'Searchable', type: 'boolean', defaultValue: true },
      { key: 'clearable', label: 'Clearable', type: 'boolean', defaultValue: true }
    ]
  },
  checkbox: {
    type: 'checkbox',
    name: 'Checkbox',
    icon: 'CheckSquare',
    defaultProps: {
      label: 'Checkbox',
      checked: false,
      disabled: false,
      required: false,
      visible: true,
      size: 'md',
      color: '#3B82F6'
    },
    defaultStyle: {},
    defaultSize: { width: 150, height: 40 },
    category: 'form',
    propertySchema: [
      { key: 'label', label: 'Label', type: 'text', defaultValue: 'Checkbox' },
      { key: 'checked', label: 'Checked', type: 'boolean', defaultValue: false },
      { key: 'visible', label: 'Visible', type: 'boolean', defaultValue: true },
      { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
      { key: 'required', label: 'Required', type: 'boolean', defaultValue: false },
      { key: 'size', label: 'Size', type: 'select', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
      { key: 'color', label: 'Color', type: 'color', defaultValue: '#3B82F6' }
    ]
  },
  customfunction: {
    type: 'customfunction',
    name: 'Custom',
    icon: 'Code',
    defaultProps: {
      html: '<div class="custom-component">\n  <h3>Custom Component</h3>\n  <p>Edit the HTML, CSS, and JavaScript to create your custom component</p>\n</div>',
      css: '.custom-component {\n  padding: 20px;\n  background: #f0f0f0;\n  border-radius: 8px;\n}\n\n.custom-component h3 {\n  margin: 0 0 10px 0;\n  color: #333;\n}',
      javascript: '// Your custom JavaScript code here\nconsole.log("Custom component loaded");',
      props: {},
      visible: true,
      height: 300
    },
    defaultStyle: {},
    defaultSize: { width: 400, height: 300 },
    category: 'custom',
    propertySchema: [
      { key: 'height', label: 'Height', type: 'number', defaultValue: 300 },
      { key: 'visible', label: 'Visible', type: 'boolean', defaultValue: true }
    ]
  },
  radio: {
    type: 'radio',
    name: 'Radio',
    icon: 'Circle',
    defaultProps: {
      label: 'Radio Group',
      value: '',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' }
      ],
      disabled: false,
      required: false,
      visible: true
    },
    defaultStyle: {},
    defaultSize: { width: 200, height: 100 },
    category: 'form',
    propertySchema: []
  },
  switch: {
    type: 'switch',
    name: 'Switch',
    icon: 'ToggleLeft',
    defaultProps: {
      label: 'Switch',
      checked: false,
      disabled: false,
      visible: true
    },
    defaultStyle: {},
    defaultSize: { width: 150, height: 40 },
    category: 'form',
    propertySchema: []
  },
  slider: {
    type: 'slider',
    name: 'Slider',
    icon: 'SlidersHorizontal',
    defaultProps: {
      label: 'Slider',
      value: 50,
      min: 0,
      max: 100,
      step: 1,
      disabled: false,
      visible: true
    },
    defaultStyle: {},
    defaultSize: { width: 300, height: 60 },
    category: 'form',
    propertySchema: []
  },
  datepicker: {
    type: 'datepicker',
    name: 'Date Picker',
    icon: 'Calendar',
    defaultProps: {
      label: 'Date',
      value: '',
      format: 'YYYY-MM-DD',
      disabled: false,
      required: false,
      visible: true
    },
    defaultStyle: {},
    defaultSize: { width: 250, height: 75 },
    category: 'form',
    propertySchema: []
  },
  fileupload: {
    type: 'fileupload',
    name: 'File Upload',
    icon: 'Upload',
    defaultProps: {
      label: 'Upload File',
      accept: '*',
      multiple: false,
      maxSize: 10485760,
      disabled: false,
      visible: true
    },
    defaultStyle: {},
    defaultSize: { width: 300, height: 100 },
    category: 'form',
    propertySchema: []
  },
  chart: {
    type: 'chart',
    name: 'Chart',
    icon: 'BarChart3',
    defaultProps: {
      type: 'bar',
      data: [],
      visible: true
    },
    defaultStyle: {},
    defaultSize: { width: 500, height: 300 },
    category: 'data',
    propertySchema: []
  },
  list: {
    type: 'list',
    name: 'List',
    icon: 'List',
    defaultProps: {
      items: [],
      visible: true
    },
    defaultStyle: {},
    defaultSize: { width: 300, height: 400 },
    category: 'data',
    propertySchema: []
  },
  container: {
    type: 'container',
    name: 'Container',
    icon: 'Box',
    defaultProps: {
      visible: true
    },
    defaultStyle: {
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px'
    },
    defaultSize: { width: 400, height: 300 },
    category: 'layout',
    propertySchema: []
  },
  modal: {
    type: 'modal',
    name: 'Modal',
    icon: 'Square',
    defaultProps: {
      title: 'Modal',
      visible: false
    },
    defaultStyle: {},
    defaultSize: { width: 500, height: 400 },
    category: 'layout',
    propertySchema: []
  },
  tabs: {
    type: 'tabs',
    name: 'Tabs',
    icon: 'Tabs',
    defaultProps: {
      tabs: [
        { id: 'tab1', label: 'Tab 1', content: [] },
        { id: 'tab2', label: 'Tab 2', content: [] }
      ],
      activeTab: 'tab1',
      visible: true
    },
    defaultStyle: {},
    defaultSize: { width: 600, height: 400 },
    category: 'layout',
    propertySchema: []
  }
};

export const getComponentDefinition = (type: ComponentType): ComponentDefinition => {
  return componentDefinitions[type];
};

export const getAllComponentsByCategory = () => {
  const categorized: Record<string, ComponentDefinition[]> = {
    basic: [],
    form: [],
    data: [],
    layout: [],
    advanced: [],
    custom: []
  };

  Object.values(componentDefinitions).forEach(def => {
    categorized[def.category].push(def);
  });

  return categorized;
};
