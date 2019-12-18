# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Function to tracing all services."""
import opentracing

from sbc_common_components.tracing.trace_tags import TraceTags


class DBTracing:  # pylint: disable=too-few-public-methods
    """Tracer that can trace certain database actions."""

    @staticmethod
    def query_tracing(conn,  # pylint: disable=unused-argument,too-many-arguments
                      cursor,  # pylint: disable=unused-argument
                      statement: str,
                      parameters,
                      context,  # pylint: disable=unused-argument
                      executemany):  # pylint: disable=unused-argument
        """Tracing sql statement before cursor execute. bypass the empty statement and ops check statement."""
        if statement and not statement.isspace() and statement != 'select 1':
            tracer = opentracing.tracer

            with (tracer.start_active_span('query')) as scope:
                span = scope.span
                span.set_tag(TraceTags.COMPONENT, 'database')
                span.log_kv({TraceTags.DATABASE_QUERY: '{} {}'.format(statement, parameters)})
