const userSchema = {
  title: 'user schema',
  type: 'object',
  properties: {
    id: {
      type: 'number'
    },
    login: {
      type: 'string'
    },
    gravatar_id: {
      type: 'string'
    },
    url: {
      type: 'string'
    },
    avatar_url: {
      type: 'string'
    }
  }
};
const listPublicEventsSchema = {
  title: 'list public events schema',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {
        type: 'string'
      },
      type: {
        type: 'string',
        enum: [
          'CommitCommentEvent',
          'CreateEvent',
          'DeleteEvent',
          'ForkEvent',
          'GollumEvent',
          'IssueCommentEvent',
          'IssuesEvent',
          'MemberEvent',
          'PublicEvent',
          'PullRequestEvent',
          'PullRequestReviewEvent',
          'PullRequestReviewCommentEvent',
          'PullRequestReviewThreadEvent',
          'PushEvent',
          'ReleaseEvent',
          'SponsorshipEvent',
          'WatchEvent'
        ]
      },
      actor: userSchema,
      repo: {
        type: 'object',
        properties: {
          id: {
            type: 'number'
          },
          name: {
            type: 'string'
          },
          url: {
            type: 'string'
          }
        }
      },
      payload: {
        type: 'object',
        properties: {
          push_id: {
            type: 'number'
          },
          size: {
            type: 'number'
          },
          distinct_size: {
            type: 'number'
          },
          head: {
            type: 'string'
          },
          before: {
            type: 'string'
          },
          commits: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                sha: {
                  type: 'string'
                },
                author: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string'
                    },
                    email: {
                      type: 'string'
                    }
                  }
                },
                message: {
                  type: 'string'
                },
                distinct: {
                  type: 'boolean'
                },
                url: {
                  type: 'string'
                }
              }
            }
          }
        }
      },
      public: {
        type: 'boolean'
      },
      created_at: {
        type: 'string'
      },
      org: userSchema
    }
  }
};

exports.listPublicEventsSchema = listPublicEventsSchema;
