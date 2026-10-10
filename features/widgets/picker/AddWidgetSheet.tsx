import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Modal } from "@/components/ui/Modal";
import { colors } from "@/constants/theme";
import { spanLabel } from "@/features/widgets/core/spans";
import type { Span, WidgetDefinition } from "@/features/widgets/core/types";
import { WidgetPreview, type CellMetrics } from "@/features/widgets/picker/WidgetPreview";

interface AddWidgetSheetProps {
    insertIndex: number | null;
    definitions: WidgetDefinition[];
    cell: CellMetrics;
    onAdd: (definition: WidgetDefinition, variant: string, span: Span) => void;
    onClose: () => void;
}

const optionsOf = (definition: WidgetDefinition) =>
    Object.entries(definition.variants).flatMap(([variant, v]) =>
        v.spans.map((span) => ({ variant, variantLabel: v.label, span }))
    );

export function AddWidgetSheet({
    insertIndex,
    definitions,
    cell,
    onAdd,
    onClose,
}: AddWidgetSheetProps) {
    const [selected, setSelected] = useState<WidgetDefinition | null>(null);

    const close = () => {
        setSelected(null);
        onClose();
    };

    const add = (definition: WidgetDefinition, variant: string, span: Span) => {
        onAdd(definition, variant, { w: span.w, h: span.h });
        close();
    };

    const chooseType = (definition: WidgetDefinition) => {
        const options = optionsOf(definition);
        if (options.length === 1) add(definition, options[0].variant, options[0].span);
        else setSelected(definition);
    };

    const multipleVariants = selected ? Object.keys(selected.variants).length > 1 : false;

    return (
        <Modal visible={insertIndex !== null} onClose={close}>
            <View className="max-h-[560px] w-[280px]">
                <View className="mb-lg flex-row items-center gap-2xs">
                    {selected ? (
                        <Pressable onPress={() => setSelected(null)} hitSlop={8}>
                            <Ionicons
                                name="chevron-back"
                                size={18}
                                color={colors.action["primary-active"]}
                            />
                        </Pressable>
                    ) : (
                        <View className="w-[18px]" />
                    )}
                    <Text className="flex-1 text-center font-display-semibold text-[17px] text-text-primary">
                        {selected ? selected.label : "Add a widget"}
                    </Text>
                    <View className="w-[18px]" />
                </View>

                <ScrollView contentContainerClassName="gap-sm">
                    {selected
                        ? optionsOf(selected).map((option) => (
                              <Pressable
                                  key={`${option.variant}-${option.span.w}x${option.span.h}`}
                                  onPress={() => add(selected, option.variant, option.span)}
                                  className="items-center gap-2xs rounded-card bg-surface-subtle p-md"
                              >
                                  <WidgetPreview
                                      definition={selected}
                                      variant={option.variant}
                                      span={option.span}
                                      cell={cell}
                                      maxWidth={220}
                                      maxHeight={160}
                                  />
                                  <Text className="font-body-semibold text-2xs text-text-primary">
                                      {multipleVariants
                                          ? `${option.variantLabel} · ${spanLabel(option.span)}`
                                          : spanLabel(option.span)}
                                  </Text>
                              </Pressable>
                          ))
                        : definitions.map((definition) => {
                              const first = optionsOf(definition)[0];
                              return (
                                  <Pressable
                                      key={definition.type}
                                      onPress={() => chooseType(definition)}
                                      className="flex-row items-center gap-sm rounded-card bg-surface-subtle p-sm"
                                  >
                                      {first ? (
                                          <WidgetPreview
                                              definition={definition}
                                              variant={first.variant}
                                              span={first.span}
                                              cell={cell}
                                              maxWidth={72}
                                          />
                                      ) : null}
                                      <Text className="flex-1 font-body-medium text-xs text-text-primary">
                                          {definition.label}
                                      </Text>
                                      <Ionicons
                                          name="chevron-forward"
                                          size={16}
                                          color={colors.text.tertiary}
                                      />
                                  </Pressable>
                              );
                          })}
                </ScrollView>
            </View>
        </Modal>
    );
}
