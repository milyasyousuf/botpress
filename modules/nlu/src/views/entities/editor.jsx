import React from 'react'
import SplitterLayout from 'react-splitter-layout'
import style from './style.scss'
import { ListGroupItem, Glyphicon, Label } from 'react-bootstrap'
import _ from 'lodash'

export default class EntityEditor extends React.Component {
  constructor(props) {
    super(props)
    this.synonymInputRef = React.createRef()
  }

  state = {
    occurence: undefined,
    entity: undefined,
    synonym: ''
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entity !== this.state.entity) {
      this.setState({ entity: nextProps.entity, occurence: undefined })
    }
  }

  handleSynonymEnter = event => {
    const enterKey = 13
    if (event.keyCode === enterKey) {
      this.addSynonym()
    }
  }

  addSynonym = () => {
    const synonym = this.state.synonym
    let entity = this.state.entity
    let occurence = this.state.occurence

    if (occurence.synonyms.includes(synonym)) {
      return
    }

    occurence.synonyms = [...occurence.synonyms, synonym]
    const index = entity.occurences.findIndex(o => o.name === occurence.name)
    entity.occurences[index] = occurence

    this.synonymInputRef.current.value = ''
    this.setState({ entity, synonym: '' }, this.onUpdate)
  }

  removeSynonym = synonym => {
    let occurence = this.state.occurence
    let entity = this.state.entity

    const sIndex = occurence.synonyms.findIndex(s => s === synonym)
    occurence.synonyms.splice(sIndex, 1)

    const eIndex = entity.occurences.findIndex(o => o.name === occurence.name)
    entity.occurences[eIndex] = occurence
    this.setState({ entity }, this.onUpdate)
  }

  onSynonymChange = event => {
    const value = event.target.value
    this.setState({ synonym: value })
  }

  renderSynonyms = () => {
    const synonyms = this.state.occurence && this.state.occurence.synonyms
    if (!synonyms) {
      return null
    }
    const tags = synonyms.map(s => (
      <div>
        <Label>{s}</Label>
        <Glyphicon glyph="remove" onClick={() => this.removeSynonym(s)} />
      </div>
    ))

    return (
      <div>
        <input
          class="form-control"
          ref={this.synonymInputRef}
          type="text"
          placeholder="Enter a synonym"
          onKeyDown={this.handleSynonymEnter}
          onChange={this.onSynonymChange}
        />
        {tags}
      </div>
    )
  }

  selectOccurence = occurence => {
    if (occurence !== this.state.occurence) {
      this.setState({ occurence })
    }
  }

  renderOccurences = () => {
    const occurences = this.state.entity.occurences

    if (!occurences) {
      return null
    }

    const list = occurences.map(o => (
      <ListGroupItem className={style.entity} onClick={() => this.selectOccurence(o)}>
        {o.name}
        <Glyphicon glyph="trash" className={style.deleteEntity} />
      </ListGroupItem>
    ))

    return (
      <div>
        <input class="form-control" ref={this.synonymInputRef} type="text" placeholder="Enter an occurence" />
        {list}
      </div>
    )
  }

  onUpdate = () => {
    this.props.onUpdate(this.state.entity)
  }

  render() {
    if (!this.state.entity) {
      return null
    }

    return (
      <div className={style.container}>
        <div className={style.header}>
          <div className="pull-left">
            <h1>
              entities/
              <span className={style.intent}>{this.state.entity.name}</span>
            </h1>
          </div>
        </div>
        <SplitterLayout secondaryInitialSize={350} secondaryMinSize={200}>
          <div>{this.renderOccurences()}</div>
          <div>{this.renderSynonyms()}</div>
        </SplitterLayout>
      </div>
    )
  }
}