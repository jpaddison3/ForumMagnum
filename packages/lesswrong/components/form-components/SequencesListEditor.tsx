import React from 'react';
import PropTypes from 'prop-types';
import { makeSortableListComponent } from './sortableList';
import { registerComponent, Components } from '../../lib/vulcan-lib';

const styles = (theme: ThemeType): JssStyles => ({
  root: {
  },
  item: {
    listStyle: "none",
    position: "relative",
    padding: 5,
  },
});

const SortableList = makeSortableListComponent({
  renderItem: ({contents, removeItem, classes}) => {
    return <li className={classes.item}>
      <Components.SequencesListEditorItem documentId={contents} removeItem={removeItem} />
    </li>
  }
});

const SequencesListEditor = ({value, path, label, classes}: {
  value: string[],
  path: string,
  label: string,
  classes: ClassesType,
}, context) => {
  const { updateCurrentValues } = context;
  return <div className={classes.root}>
    <SortableList
      value={value}
      setValue={(newValue: string[]) => {
        updateCurrentValues({[path]: newValue});
      }}
      classes={classes}
    />
    <Components.SequencesSearchAutoComplete
      clickAction={(sequenceId: string) => {
        updateCurrentValues({ [path]: [...value, sequenceId] });
      }}
    />
  </div>
}

(SequencesListEditor as any).contextTypes = {
  updateCurrentValues: PropTypes.func,
  addToSuccessForm: PropTypes.func,
};

// TODO: Does not work in nested contexts because it doesn't use the
// vulcan-forms APIs correctly.
const SequencesListEditorComponent = registerComponent("SequencesListEditor", SequencesListEditor, {styles});

declare global {
  interface ComponentTypes {
    SequencesListEditor: typeof SequencesListEditorComponent
  }
}
