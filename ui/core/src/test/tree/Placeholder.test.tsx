/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import { mount, shallow } from "enzyme";
import * as React from "react";
import { LEVEL_OFFSET } from "../../ui-core/tree/Node";
import Placeholder from "../../ui-core/tree/Placeholder";

describe("<Placeholder />", () => {

  it("should render", () => {
    mount(<Placeholder level={0} />);
  });

  it("should set left padding based on level", () => {
    const wrapper = shallow(<Placeholder level={9} />);
    const style: CSSStyleDeclaration = wrapper.prop("style");
    const padding = parseInt(style.paddingLeft!.match(/(\d+)\s*(px)?/)![1], 10);
    padding.should.eq(9 * LEVEL_OFFSET);
  });

  it("should set width between minWidth and maxWidth", () => {
    let repeats = 100;
    while (repeats--) {
      const wrapper = shallow(<Placeholder data-testid="ph" level={0} minWidth={10} maxWidth={100} />);
      const style: CSSStyleDeclaration = wrapper.find({ className: "contents" }).prop("style");
      const width = parseInt(style.width!.match(/(\d+)\s*px/)![1], 10);
      width.should.be.gte(10).and.lte(100);
    }
  });

});
