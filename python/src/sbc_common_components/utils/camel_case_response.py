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

"""Camel case response builder.

An after request util to convert all response keys to camelCase from snake_case.
"""
import json
from typing import Dict
from flask import request


def convert_to_camel(response):
    """Convert keys to camelCase."""

    if response.headers['Content-Type'] == 'application/json' and 'swagger.json' not in request.base_url:
        response.set_data(json.dumps(camelcase_dict(json.loads(response.get_data()), {})))
    return response


def camelcase(string):
    """Convert a snake_cased string to camelCase."""
    if '_' not in string or string.startswith('_'):
        return string
    return ''.join([
        x.capitalize() if i > 0 else x
        for i, x in enumerate(string.split('_'))
    ])


def camelcase_dict(data, camel_dict: Dict[str, any]):
    """Iterate through the dict and convert to camel case."""

    if isinstance(data, list):
        if not data:  # empty array is falsy
            return []
        return [camelcase_dict(item, {}) for item in data]

    if isinstance(data, dict):
        if not data:  # empty dict is falsy
            return {}

        for key, value in data.items():
            key = camelcase(key)
            if isinstance(value, dict):
                camel_dict[key] = camelcase_dict(value, {})
            elif isinstance(value, list):
                camel_dict[key] = []
                for list_value in value:
                    camel_dict[key].append(
                        list_value if isinstance(list_value, str) else camelcase_dict(list_value, {}))
            else:
                camel_dict[key] = value

        return camel_dict

    return None
