import { SeriesAuthors } from '@modules/Series/SeriesAuthors';
import LiteratureCover from '@modules/Literature/LiteratureCover';
import { SeriesLanguages } from '@modules/Series/SeriesLanguages';
import { FrontSiteRoutes } from '@routes/urls';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Truncate from 'react-truncate';
import { Grid, Item, Label, List } from 'semantic-ui-react';

export default class SeriesListEntry extends Component {
  constructor(props) {
    super(props);
    this.metadata = props.metadata;
  }

  renderImage = () => {
    const { volume } = this.props;
    const image = (
      <Item.Image
        floated="left"
        as={Link}
        to={FrontSiteRoutes.seriesDetailsFor(this.metadata.pid)}
      >
        <LiteratureCover
          asItem
          size="small"
          url={_get(this, 'metadata.cover_metadata.urls.medium')}
        />
      </Item.Image>
    );

    if (volume) {
      return (
        <div className="search-result-image">
          <Label floating color="black">
            Volume {volume}
          </Label>
          {image}
        </div>
      );
    }

    return image;
  };

  render() {
    return (
      <Item>
        {this.renderImage()}
        <Item.Content>
          <Item.Meta>SERIES</Item.Meta>
          <Item.Header
            as={Link}
            to={FrontSiteRoutes.seriesDetailsFor(this.metadata.pid)}
          >
            {this.metadata.title}
          </Item.Header>
          <Item.Meta>
            <SeriesAuthors authors={this.metadata.authors} prefix="by " />
          </Item.Meta>
          <Item.Description>
            <Truncate lines={3} ellipsis="... ">
              {this.metadata.abstract}
            </Truncate>
          </Item.Description>
          <Item.Meta>
            <Grid>
              <Grid.Column width={4}>
                <List>
                  {this.metadata.edition && (
                    <List.Item>
                      <List.Content>
                        <span>Edition: </span>
                        {this.metadata.edition}
                      </List.Content>
                    </List.Item>
                  )}
                  {this.metadata.publisher && (
                    <List.Item>
                      <List.Content>
                        <span>Publisher: </span>
                        {this.metadata.publisher}
                      </List.Content>
                    </List.Item>
                  )}
                  <List.Item>
                    <List.Content>
                      <span>Languages: </span>
                      <SeriesLanguages languages={this.metadata.languages} />
                    </List.Content>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid>
          </Item.Meta>
        </Item.Content>
      </Item>
    );
  }
}

SeriesListEntry.propTypes = {
  metadata: PropTypes.object.isRequired,
  volume: PropTypes.string,
};

SeriesListEntry.defaultProps = {
  volume: null,
};
